import type { UserId } from './user';

export type CoupleId = string;

/** A Couple is an optional private bond between two users. */
export interface CoupleProfile {
  id: CoupleId;
  partnerA: UserId;
  partnerB: UserId;
  anniversary?: string; // ISO date string
  coupleThemeId?: string;
  petName?: string; // nickname for the couple
  createdAt: string;
}

export interface Anniversary {
  id: string;
  coupleId: CoupleId;
  title: string;
  date: string; // ISO date string
  isRecurringYearly: boolean;
  reminderDaysBefore: number;
}

export interface SharedMemory {
  id: string;
  coupleId: CoupleId;
  title: string;
  description?: string;
  mediaUrls: string[];
  memoryDate: string;
  tags: string[];
  isPrivate: boolean; // private = only visible to the two partners
  createdAt: string;
}

export interface LoveLetter {
  id: string;
  coupleId: CoupleId;
  fromUserId: UserId;
  toUserId: UserId;
  /** Stored encrypted on server; key held by the two partners only. */
  encryptedContent: string;
  createdAt: string;
  deliveredAt?: string;
}

export interface MoodCheckIn {
  id: string;
  userId: UserId;
  coupleId: CoupleId;
  mood: 'great' | 'good' | 'okay' | 'down' | 'struggling';
  note?: string;
  /** Visible only to the partner. */
  sharedWithPartner: boolean;
  createdAt: string;
}

export interface BucketListItem {
  id: string;
  coupleId: CoupleId;
  title: string;
  description?: string;
  isCompleted: boolean;
  completedAt?: string;
  imageUrl?: string;
  addedBy: UserId;
  createdAt: string;
}
