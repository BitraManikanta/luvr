/** Core user and account types shared across mobile, web, and API. */

export type UserId = string;
export type DeviceId = string;

export interface User {
  id: UserId;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  isPrivate: boolean;
  isVerified: boolean;
  followerCount: number;
  followingCount: number;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

export interface PublicProfile extends User {
  isFollowing: boolean;
  isFollowedBy: boolean;
  isBlocked: boolean;
  isMuted: boolean;
}

export interface AccountSettings {
  whoCanContact: 'everyone' | 'followers' | 'nobody';
  whoCanFollow: 'everyone' | 'nobody';
  whoCanSeeOnlineStatus: 'everyone' | 'followers' | 'nobody';
  whoCanSeeReadReceipts: 'everyone' | 'followers' | 'nobody';
  whoCanSeeStories: 'everyone' | 'close-friends' | 'followers' | 'nobody';
  showActivityStatus: boolean;
  readReceiptsEnabled: boolean;
  notificationPreviewMode: 'full' | 'name-only' | 'none';
  appLockEnabled: boolean;
  biometricLockEnabled: boolean;
}

export interface Device {
  id: DeviceId;
  userId: UserId;
  name: string;
  platform: 'ios' | 'android' | 'web';
  /** The device's public identity key (base64-encoded). Never the private key. */
  identityKeyPublic: string;
  registrationId: number;
  lastSeen: string;
  createdAt: string;
}

export type FollowStatus = 'none' | 'pending' | 'following';
