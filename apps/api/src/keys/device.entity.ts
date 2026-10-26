/**
 * Device entity — stores per-device public key material.
 * Private keys NEVER leave the client device.
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
import { UserEntity } from '../users/user.entity';

@Entity('devices')
export class DeviceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  @Index()
  userId!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 10 })
  platform!: 'ios' | 'android' | 'web';

  /** The device's public identity key — base64 encoded. Never the private key. */
  @Column({ name: 'identity_key_public', type: 'text' })
  identityKeyPublic!: string;

  /** Signal registration ID (0-16383). */
  @Column({ name: 'registration_id', type: 'int' })
  registrationId!: number;

  @Column({ name: 'push_token', nullable: true, type: 'text' })
  pushToken!: string | null;

  @Column({ name: 'push_platform', nullable: true, length: 10 })
  pushPlatform!: 'fcm' | 'apns' | null;

  @Column({ name: 'last_seen_at', type: 'timestamp with time zone', nullable: true })
  lastSeenAt!: Date | null;

  @Column({ name: 'is_revoked', default: false })
  isRevoked!: boolean;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;
}
