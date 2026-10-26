/**
 * Media encryption utilities.
 *
 * Media files are encrypted on the client BEFORE upload using AES-256-GCM.
 * The key and nonce are embedded in the encrypted message envelope (which is
 * itself E2E encrypted) — they NEVER reach the server in plaintext.
 *
 * Schema:
 *   encryptedBlob = AES-256-GCM(key, nonce, plaintext_media)
 *   The key and nonce are transmitted only inside the Signal-encrypted message body.
 *
 * This module uses the Web Crypto API (available in React Native via
 * the built-in `crypto` global since RN 0.71+).
 */

export interface MediaEncryptionResult {
  /** The encrypted media bytes. */
  ciphertext: Uint8Array;
  /** 32-byte AES key, base64. Include in the message body — never in the upload URL. */
  key: string;
  /** 12-byte GCM nonce, base64. */
  nonce: string;
  /** AES-256-GCM auth tag is appended to ciphertext by WebCrypto. */
}

export interface MediaDecryptionInput {
  ciphertext: Uint8Array;
  key: string;   // base64
  nonce: string; // base64
}

function getCrypto(): Crypto {
  if (typeof crypto !== 'undefined') return crypto;
  // Node.js 19+ has globalThis.crypto
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('crypto').webcrypto as Crypto;
}

/**
 * Encrypt a media file buffer using AES-256-GCM.
 * Returns the ciphertext plus the key and nonce (to be embedded in the message).
 */
export async function encryptMedia(plaintext: Uint8Array): Promise<MediaEncryptionResult> {
  const cryptoApi = getCrypto();

  // Generate a fresh 256-bit key and 96-bit nonce for each file
  const keyBytes = cryptoApi.getRandomValues(new Uint8Array(32));
  const nonce = cryptoApi.getRandomValues(new Uint8Array(12));

  const cryptoKey = await cryptoApi.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt'],
  );

  const ciphertextBuffer = await cryptoApi.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce, tagLength: 128 },
    cryptoKey,
    plaintext,
  );

  return {
    ciphertext: new Uint8Array(ciphertextBuffer),
    key: Buffer.from(keyBytes).toString('base64'),
    nonce: Buffer.from(nonce).toString('base64'),
  };
}

/**
 * Decrypt a received encrypted media blob.
 */
export async function decryptMedia(input: MediaDecryptionInput): Promise<Uint8Array> {
  const cryptoApi = getCrypto();

  const keyBytes = Buffer.from(input.key, 'base64');
  const nonce = Buffer.from(input.nonce, 'base64');

  const cryptoKey = await cryptoApi.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['decrypt'],
  );

  const plaintextBuffer = await cryptoApi.subtle.decrypt(
    { name: 'AES-GCM', iv: nonce, tagLength: 128 },
    cryptoKey,
    input.ciphertext,
  );

  return new Uint8Array(plaintextBuffer);
}

/**
 * Generate a secure random attachment ID (not guessable from the URL).
 */
export function generateAttachmentId(): string {
  const bytes = getCrypto().getRandomValues(new Uint8Array(16));
  return Buffer.from(bytes).toString('hex');
}
