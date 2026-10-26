/**
 * EncryptedEnvelopeEntity
 *
 * This is what the server stores. It NEVER contains plaintext.
 * The ciphertext blob is opaque to the server.
 *
 * Phase 1-3: ciphertext stores the plaintext (development only, clearly flagged).
 * Phase 4+:  ciphertext stores the Signal Protocol encrypted payload.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ConversationEntity } from '../conversations/conversation.entity';

@Entity('encrypted_envelopes')
@Index(['conversationId', 'createdAt'])
export class EncryptedEnvelopeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'conversation_id' })
  @Index()
  conversationId!: string;

  @Column({ name: 'sender_device_id', length: 36 })
  @Index()
  senderDeviceId!: string;

  @Column({ name: 'recipient_device_id', length: 36 })
  @Index()
  recipientDeviceId!: string;

  /** Base64-encoded ciphertext (opaque to server). */
  @Column({ name: 'ciphertext', type: 'text' })
  ciphertext!: string;

  /** Signal protocol message type (0 = whisper, 3 = prekey). */
  @Column({ name: 'message_type', type: 'smallint', default: 0 })
  messageType!: number;

  /** Client-generated idempotency key to prevent duplicate sends. */
  @Column({ name: 'idempotency_key', length: 36 })
  @Index({ unique: true })
  idempotencyKey!: string;

  @Column({ name: 'expires_at', nullable: true, type: 'timestamp with time zone' })
  expiresAt!: Date | null;

  /** Whether the envelope has been delivered to the recipient device. */
  @Column({ name: 'is_delivered', default: false })
  isDelivered!: boolean;

  @Column({ name: 'delivered_at', nullable: true, type: 'timestamp with time zone' })
  deliveredAt!: Date | null;

  @ManyToOne(() => ConversationEntity, (c) => c.envelopes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation_id' })
  conversation!: ConversationEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;
}
