import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 30 })
  @Index()
  username!: string;

  @Column({ name: 'display_name', length: 50 })
  displayName!: string;

  @Column({ unique: true, length: 255 })
  @Index()
  email!: string;

  @Column({ name: 'password_hash', length: 255, select: false })
  passwordHash!: string;

  @Column({ name: 'avatar_url', nullable: true, type: 'text' })
  avatarUrl!: string | null;

  @Column({ nullable: true, type: 'text' })
  bio!: string | null;

  @Column({ name: 'is_private', default: false })
  isPrivate!: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified!: boolean;

  @Column({ name: 'is_deleted', default: false })
  isDeleted!: boolean;

  @Column({ name: 'deleted_at', nullable: true, type: 'timestamp with time zone' })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;
}
