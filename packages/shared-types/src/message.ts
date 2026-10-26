/** Message types. The server only ever sees encrypted envelopes – never plaintext. */

import type { UserId, DeviceId } from './user';
import type { MediaAttachment } from './media';

export type MessageId = string;
export type ConversationId = string;

/** What the client stores locally after decryption. Never sent to or stored by the server. */
export interface DecryptedMessage {
  id: MessageId;
  conversationId: ConversationId;
  senderId: UserId;
  senderDeviceId: DeviceId;

  type: MessageType;
  text?: string;
  attachments?: MediaAttachment[];
  replyToId?: MessageId;
  reactions: MessageReaction[];
  isEdited: boolean;
  isDeleted: boolean;
  disappearsAt?: string; // ISO 8601

  /** Client-side delivery state. */
  deliveryState: MessageDeliveryState;

  createdAt: string;
  editedAt?: string;
}

/** What the server stores: an opaque encrypted envelope. */
export interface EncryptedEnvelope {
  id: MessageId;
  conversationId: ConversationId;
  senderDeviceId: DeviceId;
  recipientDeviceId: DeviceId;
  /** The Signal-protocol ciphertext blob, base64-encoded. */
  ciphertext: string;
  messageType: number; // Signal protocol message type
  idempotencyKey: string;
  serverReceivedAt: string;
  expiresAt?: string;
}

export type MessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'sticker'
  | 'gif'
  | 'location'
  | 'game-invite'
  | 'game-turn'
  | 'couple-activity'
  | 'call-event'
  | 'system';

export type MessageDeliveryState =
  | 'local'       // saved locally, not yet sent
  | 'pending'     // queued, waiting for connectivity
  | 'sending'     // in flight
  | 'sent'        // accepted by server
  | 'delivered'   // delivered to recipient device
  | 'read'        // read by recipient
  | 'failed';     // permanent or retriable failure

export interface MessageReaction {
  userId: UserId;
  emoji: string;
  createdAt: string;
}

export interface TypingIndicator {
  conversationId: ConversationId;
  userId: UserId;
  isTyping: boolean;
}

export interface MessageSearchResult {
  message: DecryptedMessage;
  conversationId: ConversationId;
  highlight: string;
}
