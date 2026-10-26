import type { UserId } from './user';

export type StoryId = string;

/** Stories are public or semi-public content — NOT end-to-end encrypted
 *  in the same way as private messages. The storage and audience model
 *  is disclosed to the user before posting.
 */
export interface Story {
  id: StoryId;
  authorId: UserId;
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  audience: StoryAudience;
  viewerCount: number;
  hasViewed: boolean;
  expiresAt: string; // 24 h from creation by default
  createdAt: string;
}

export type StoryAudience = 'public' | 'followers' | 'close-friends' | StoryCustomAudience;

export interface StoryCustomAudience {
  type: 'custom';
  allowedUserIds: UserId[];
  excludedUserIds: UserId[];
}

export interface StoryReaction {
  storyId: StoryId;
  userId: UserId;
  emoji: string;
  createdAt: string;
}

export interface StoryViewer {
  userId: UserId;
  viewedAt: string;
}
