/**
 * Prekey entities — store public prekey material for E2E session establishment.
 * These are PUBLIC keys only. The corresponding private keys never leave the device.
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
import { DeviceEntity } from './device.entity';

@Entity('signed_prekeys')
export class SignedPrekeyEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'device_id' })
  @Index()
  deviceId!: string;

  @Column({ name: 'key_id', type: 'int' })
  keyId!: number;

  /** Base64-encoded public key. */
  @Column({ name: 'public_key', type: 'text' })
  publicKey!: string;

  /** Base64-encoded signature over the public key, made with the identity key. */
  @Column({ type: 'text' })
  signature!: string;

  @ManyToOne(() => DeviceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'device_id' })
  device!: DeviceEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;
}

@Entity('one_time_prekeys')
@Index(['deviceId', 'isConsumed'])
export class OneTimePrekeyEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'device_id' })
  @Index()
  deviceId!: string;

  @Column({ name: 'key_id', type: 'int' })
  keyId!: number;

  @Column({ name: 'public_key', type: 'text' })
  publicKey!: string;

  @Column({ name: 'is_consumed', default: false })
  isConsumed!: boolean;

  @Column({ name: 'consumed_at', nullable: true, type: 'timestamp with time zone' })
  consumedAt!: Date | null;

  @ManyToOne(() => DeviceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'device_id' })
  device!: DeviceEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;
}
