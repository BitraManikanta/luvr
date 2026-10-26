/** Media attachment types.
 *
 * Media is always encrypted on the client before upload.
 * The server stores the encrypted blob and an opaque attachment reference.
 * The decryption key and IV are embedded inside the encrypted message envelope
 * and never transmitted separately to the server.
 */

export type MediaId = string;

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'gif';

export interface MediaAttachment {
  id: MediaId;
  type: MediaType;
  /** Server URL of the encrypted blob. Requires short-lived auth token to fetch. */
  encryptedUrl: string;
  /** MIME type of the original file. */
  mimeType: string;
  /** File size of the encrypted blob in bytes. */
  encryptedSizeBytes: number;
  /** Width / height for images and video (from client metadata). */
  width?: number;
  height?: number;
  /** Duration in seconds for audio and video. */
  durationSeconds?: number;
  /** Encrypted thumbnail URL, if applicable. */
  encryptedThumbnailUrl?: string;
  fileName?: string;
}

/** Tracks upload progress on the client. Never persisted to the server. */
export interface MediaUploadJob {
  localUri: string;
  attachmentId: MediaId;
  progress: number; // 0–1
  status: 'pending' | 'encrypting' | 'uploading' | 'done' | 'failed' | 'paused';
  bytesUploaded: number;
  totalBytes: number;
  /** Resumable upload URL (short-lived). */
  resumeUrl?: string;
  retryCount: number;
  error?: string;
}
