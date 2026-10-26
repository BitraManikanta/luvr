import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ConversationParticipantEntity } from './conversation-participant.entity';
import { EncryptedEnvelopeEntity } from '../messages/encrypted-envelope.entity';

@Entity('conversations')
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 10 })
  @Index()
  type!: 'direct' | 'group';

  @Column({ nullable: true, length: 100 })
  name!: string | null;

  @Column({ name: 'avatar_url', nullable: true, type: 'text' })
  avatarUrl!: string | null;

  /** Seconds after which messages auto-expire. 0 = disabled. */
  @Column({ name: 'disappearing_message_seconds', default: 0 })
  disappearingMessageSeconds!: number;

  @OneToMany(() => ConversationParticipantEntity, (p) => p.conversation, { cascade: true })
  participants!: ConversationParticipantEntity[];

  @OneToMany(() => EncryptedEnvelopeEntity, (e) => e.conversation)
  envelopes!: EncryptedEnvelopeEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;
}
