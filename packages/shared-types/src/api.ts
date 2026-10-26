/** Shared API response/request shapes used by both the mobile app and web. */

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  prevCursor?: string;
  total?: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requestId?: string;
}

export interface ApiResponse<T> {
  data: T;
  requestId: string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  version: string;
  timestamp: string;
  services: Record<string, 'ok' | 'degraded' | 'down'>;
}

// ---- Auth ----

export interface RegisterRequest {
  username: string;
  phoneNumber?: string;
  email?: string;
  password: string;
  /** Client-generated device identity key (public only). */
  deviceIdentityKeyPublic: string;
  registrationId: number;
  deviceName: string;
  platform: 'ios' | 'android' | 'web';
}

export interface LoginRequest {
  identifier: string; // username, email, or phone
  password: string;
  deviceIdentityKeyPublic: string;
  registrationId: number;
  deviceName: string;
  platform: 'ios' | 'android' | 'web';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ---- Key exchange ----

export interface UploadPrekeysRequest {
  /** Base64-encoded signed prekey. */
  signedPrekey: SignedPrekey;
  /** Array of one-time prekeys. */
  oneTimePrekeys: OneTimePrekey[];
  /** Identity key confirmation. */
  identityKeyPublic: string;
}

export interface SignedPrekey {
  keyId: number;
  publicKey: string; // base64
  signature: string; // base64
}

export interface OneTimePrekey {
  keyId: number;
  publicKey: string; // base64
}

export interface PrekeysResponse {
  recipientDeviceId: string;
  identityKeyPublic: string;
  signedPrekey: SignedPrekey;
  oneTimePrekey?: OneTimePrekey;
}
