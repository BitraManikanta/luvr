/**
 * useMessages — real-time message hook for a single conversation.
 *
 * Fetches history from the API + listens for live WebSocket events.
 * All state is React-state only in Phase 3; Phase 4 will persist to SQLite.
 */

import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid/non-secure';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api/client';
import { socketService } from '../services/api/websocket';
import { useAuthStore } from '../stores/auth-store';
import type { DecryptedMessage, MessageType } from '@luvora/shared-types';

interface SendMessageParams {
  type: MessageType;
  text?: string;
  idempotencyKey: string;
}

export function useMessages(conversationId: string) {
  const { userId } = useAuthStore();
  const [liveMessages, setLiveMessages] = useState<DecryptedMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Fetch message history
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => apiClient.get<DecryptedMessage[]>(`/messages/conversations/${conversationId}`),
    enabled: Boolean(conversationId),
  });

  // Subscribe to live events
  useEffect(() => {
    if (!conversationId) return;

    socketService.joinConversation(conversationId);

    const unsub = socketService.onMessage((envelope) => {
      if (envelope.conversationId !== conversationId) return;

      /**
       * Phase 3: ciphertext IS the message (plaintext base64 dev mode).
       * Phase 4: this is where we decrypt the envelope using the session key.
       */
      let text: string | undefined;
      try {
        text = atob(envelope.ciphertext);
      } catch {
        text = envelope.ciphertext;
      }

      const msg: DecryptedMessage = {
        id: envelope.envelopeId,
        conversationId: envelope.conversationId,
        senderId: '', // resolved from device lookup in Phase 4
        senderDeviceId: envelope.senderDeviceId,
        type: 'text',
        text,
        reactions: [],
        isEdited: false,
        isDeleted: false,
        deliveryState: 'delivered',
        createdAt: envelope.createdAt,
      };

      setLiveMessages((prev) => {
        // Deduplicate
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      // Acknowledge receipt
      socketService.acknowledge([envelope.envelopeId]);
    });

    return () => {
      unsub();
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    async ({ type, text, idempotencyKey }: SendMessageParams) => {
      if (!userId) throw new Error('Not authenticated.');

      setIsSending(true);

      // Optimistic local message
      const optimisticId = `local_${idempotencyKey}`;
      const optimistic: DecryptedMessage = {
        id: optimisticId,
        conversationId,
        senderId: userId,
        senderDeviceId: 'local',
        type,
        text,
        reactions: [],
        isEdited: false,
        isDeleted: false,
        deliveryState: 'sending',
        createdAt: new Date().toISOString(),
      };

      setLiveMessages((prev) => [...prev, optimistic]);

      try {
        /**
         * Phase 3: encode text as base64 as a stand-in for ciphertext.
         * Phase 4: encrypt with Signal session, produce real ciphertext.
         */
        const ciphertext = btoa(text ?? '');

        // TODO: recipientDeviceId should come from conversation context
        // Using 'broadcast' placeholder until device lookup is wired in Phase 4
        await apiClient.post('/messages/send', {
          conversationId,
          senderDeviceId: 'local',
          recipientDeviceId: 'broadcast',
          ciphertext,
          messageType: 0,
          idempotencyKey,
        });

        setLiveMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticId ? { ...m, deliveryState: 'sent' } : m,
          ),
        );
      } catch (err) {
        setLiveMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticId ? { ...m, deliveryState: 'failed' } : m,
          ),
        );
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, userId],
  );

  // Merge history + live, deduplicated, sorted by time
  const messages = [...history, ...liveMessages]
    .reduce<DecryptedMessage[]>((acc, msg) => {
      if (!acc.some((m) => m.id === msg.id)) acc.push(msg);
      return acc;
    }, [])
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return { messages, isLoading, sendMessage, isSending };
}
