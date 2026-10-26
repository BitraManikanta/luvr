import type { UserId } from './user';
import type { ConversationId, DecryptedMessage, MessageDeliveryState } from './message';

export type ConversationType = 'direct' | 'group';

export interface Conversation {
  id: ConversationId;
  type: ConversationType;
  name?: string; // group name
  avatarUrl?: string;
  participants: ConversationParticipant[];
  lastMessage?: DecryptedMessage;
  unreadCount: number;
  isArchived: boolean;
  isMuted: boolean;
  isPinned: boolean;
  /** Per-conversation theme override. */
  themeId?: string;
  disappearingMessageSeconds?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  userId: UserId;
  role: 'admin' | 'member';
  joinedAt: string;
  lastReadAt?: string;
}

export interface ConversationDraft {
  conversationId: ConversationId;
  text: string;
  savedAt: string;
}

export interface DeliveryAcknowledgement {
  messageId: string;
  conversationId: ConversationId;
  recipientDeviceId: string;
  state: MessageDeliveryState;
  timestamp: string;
}
