import type { UserId } from './user';

export type PostId = string;

export interface Post {
  id: PostId;
  authorId: UserId;
  caption?: string;
  mediaUrls: string[];
  thumbnailUrls: string[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isSaved: boolean;
  hashtags: string[];
  visibility: 'public' | 'followers';
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: PostId;
  authorId: UserId;
  text: string;
  likeCount: number;
  isLiked: boolean;
  replyCount: number;
  createdAt: string;
}

export interface Like {
  userId: UserId;
  targetId: string;
  targetType: 'post' | 'comment' | 'story' | 'reel';
  createdAt: string;
}

export interface Reel {
  id: string;
  authorId: UserId;
  videoUrl: string;
  thumbnailUrl: string;
  caption?: string;
  audioTitle?: string;
  durationSeconds: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isSaved: boolean;
  hashtags: string[];
  createdAt: string;
}
