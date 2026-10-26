/**
 * Encryption round-trip tests for media-crypto.
 * Uses Node.js's built-in webcrypto — no native modules needed.
 */

import { encryptMedia, decryptMedia, generateAttachmentId } from '../media-crypto';

describe('media-crypto', () => {
  it('encrypts and decrypts a short plaintext round-trip', async () => {
    const original = new TextEncoder().encode('Hello, Luvora! 💕');
    const { ciphertext, key, nonce } = await encryptMedia(original);

    // Ciphertext should differ from plaintext
    expect(Buffer.from(ciphertext).toString()).not.toBe(Buffer.from(original).toString());

    const decrypted = await decryptMedia({ ciphertext, key, nonce });
    expect(new TextDecoder().decode(decrypted)).toBe('Hello, Luvora! 💕');
  });

  it('encrypts and decrypts binary data (simulated image bytes)', async () => {
    // Simulate 1KB of image data
    const original = new Uint8Array(1024);
    for (let i = 0; i < 1024; i++) original[i] = i % 256;

    const { ciphertext, key, nonce } = await encryptMedia(original);
    const decrypted = await decryptMedia({ ciphertext, key, nonce });

    expect(decrypted).toEqual(original);
  });

  it('produces different ciphertext for the same plaintext (fresh keys each time)', async () => {
    const plaintext = new TextEncoder().encode('same message');
    const result1 = await encryptMedia(plaintext);
    const result2 = await encryptMedia(plaintext);

    // Keys should differ (random per encryption)
    expect(result1.key).not.toBe(result2.key);
    expect(result1.nonce).not.toBe(result2.nonce);
    expect(Buffer.from(result1.ciphertext).toString('hex')).not.toBe(
      Buffer.from(result2.ciphertext).toString('hex'),
    );
  });

  it('fails decryption with wrong key', async () => {
    const plaintext = new TextEncoder().encode('secret');
    const { ciphertext, nonce } = await encryptMedia(plaintext);

    // Generate a different key
    const wrongKey = Buffer.from(
      crypto.getRandomValues(new Uint8Array(32)),
    ).toString('base64');

    await expect(decryptMedia({ ciphertext, key: wrongKey, nonce })).rejects.toThrow();
  });

  it('fails decryption with tampered ciphertext', async () => {
    const plaintext = new TextEncoder().encode('tamper test');
    const { ciphertext, key, nonce } = await encryptMedia(plaintext);

    // Flip a byte in the middle of the ciphertext
    const tampered = new Uint8Array(ciphertext);
    tampered[Math.floor(tampered.length / 2)] ^= 0xff;

    await expect(decryptMedia({ ciphertext: tampered, key, nonce })).rejects.toThrow();
  });

  it('generateAttachmentId produces 32-char hex strings', () => {
    const id1 = generateAttachmentId();
    const id2 = generateAttachmentId();

    expect(id1).toHaveLength(32);
    expect(id1).toMatch(/^[0-9a-f]+$/);
    expect(id1).not.toBe(id2); // Should be unique
  });
});
