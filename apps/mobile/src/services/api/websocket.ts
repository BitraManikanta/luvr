/**
 * WebSocket client for real-time messaging.
 * Manages the Socket.IO connection, reconnection, and event routing.
 */

import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../../stores/auth-store';
import { useAppStore } from '../../stores/app-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

type MessageListener = (envelope: {
  envelopeId: string;
  conversationId: string;
  senderDeviceId: string;
  ciphertext: string;
  messageType: number;
  createdAt: string;
}) => void;

type DeliveryListener = (receipt: {
  envelopeId: string;
  state: 'delivered' | 'read';
  timestamp: string;
}) => void;

type TypingListener = (event: {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}) => void;

class LuvoraSocketService {
  private socket: Socket | null = null;
  private connectionState: ConnectionState = 'disconnected';

  private messageListeners = new Set<MessageListener>();
  private deliveryListeners = new Set<DeliveryListener>();
  private typingListeners = new Set<TypingListener>();

  connect() {
    const token = useAuthStore.getState().accessToken;
    if (!token) return;

    if (this.socket?.connected) return;

    this.connectionState = 'connecting';

    this.socket = io(API_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30_000,
      randomizationFactor: 0.5,
    });

    this.socket.on('connect', () => {
      this.connectionState = 'connected';
      useAppStore.getState().setOnline(true);
      console.log('[WS] Connected');
    });

    this.socket.on('disconnect', (reason) => {
      this.connectionState = 'disconnected';
      console.log('[WS] Disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      this.connectionState = 'error';
      console.warn('[WS] Connection error:', err.message);
    });

    this.socket.on('new_envelope', (envelope) => {
      this.messageListeners.forEach((fn) => fn(envelope));
    });

    this.socket.on('delivery_receipt', (receipt) => {
      this.deliveryListeners.forEach((fn) => fn(receipt));
    });

    this.socket.on('typing', (event) => {
      this.typingListeners.forEach((fn) => fn(event));
    });

    // Re-deliver any queued offline messages
    this.socket.on('pending_envelopes', (envelopes: unknown[]) => {
      if (Array.isArray(envelopes)) {
        envelopes.forEach((env) => this.messageListeners.forEach((fn) => fn(env as Parameters<MessageListener>[0])));
      }
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.connectionState = 'disconnected';
  }

  joinConversation(conversationId: string) {
    this.socket?.emit('join_conversation', { conversationId });
  }

  sendMessage(payload: {
    conversationId: string;
    recipientDeviceId: string;
    ciphertext: string;
    messageType: number;
    idempotencyKey: string;
    expiresAt?: string;
  }) {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server.');
    }
    this.socket.emit('send_message', payload);
  }

  sendTyping(conversationId: string, isTyping: boolean) {
    this.socket?.emit('typing', { conversationId, isTyping });
  }

  acknowledge(envelopeIds: string[]) {
    this.socket?.emit('acknowledge', { envelopeIds });
  }

  get state(): ConnectionState {
    return this.connectionState;
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  onMessage(fn: MessageListener) {
    this.messageListeners.add(fn);
    return () => this.messageListeners.delete(fn);
  }

  onDeliveryReceipt(fn: DeliveryListener) {
    this.deliveryListeners.add(fn);
    return () => this.deliveryListeners.delete(fn);
  }

  onTyping(fn: TypingListener) {
    this.typingListeners.add(fn);
    return () => this.typingListeners.delete(fn);
  }
}

/** Singleton WebSocket service instance. */
export const socketService = new LuvoraSocketService();
