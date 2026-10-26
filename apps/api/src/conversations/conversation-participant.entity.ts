import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { UserEntity } from '../users/user.entity';

@Entity('conversation_participants')
@Index(['conversationId', 'userId'], { unique: true })
export class ConversationParticipantEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'conversation_id' })
  @Index()
  conversationId!: string;

  @Column({ name: 'user_id' })
  @Index()
  userId!: string;

  @Column({ type: 'varchar', length: 10, default: 'member' })
  role!: 'admin' | 'member';

  @Column({ name: 'last_read_message_id', nullable: true, type: 'uuid' })
  lastReadMessageId!: string | null;

  @Column({ name: 'last_read_at', nullable: true, type: 'timestamp with time zone' })
  lastReadAt!: Date | null;

  @Column({ name: 'is_muted', default: false })
  isMuted!: boolean;

  @Column({ name: 'is_archived', default: false })
  isArchived!: boolean;

  @ManyToOne(() => ConversationEntity, (c) => c.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation_id' })
  conversation!: ConversationEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @CreateDateColumn({ name: 'joined_at', type: 'timestamp with time zone' })
  joinedAt!: Date;
}
