/**
 * Cryptography adapter types.
 * These are the shapes passed between the Signal Protocol wrapper and the rest of the app.
 * They are deliberately independent of any specific Signal library version.
 */

/** Base64-encoded byte string. */
export type Base64 = string;

/** A device's long-term identity key pair. Private key stays on device only. */
export interface IdentityKeyPair {
  publicKey: Base64;
  /** SENSITIVE — never send to server, never log. */
  privateKey: Base64;
}

/** A signed prekey. Public key + signature are uploaded to server. Private stays local. */
export interface SignedPrekey {
  keyId: number;
  publicKey: Base64;
  signature: Base64;
  /** SENSITIVE */
  privateKey: Base64;
}

/** A one-time prekey. Public key is uploaded. Private stays local. */
export interface OneTimePrekey {
  keyId: number;
  publicKey: Base64;
  /** SENSITIVE */
  privateKey: Base64;
}

/** The full key bundle for device registration. */
export interface DeviceKeyBundle {
  identityKeyPair: IdentityKeyPair;
  registrationId: number;
  signedPrekey: SignedPrekey;
  oneTimePrekeys: OneTimePrekey[];
}

/** Prekey bundle retrieved from server to establish a session with a remote device. */
export interface RemotePrekeyBundle {
  recipientDeviceId: string;
  identityKeyPublic: Base64;
  registrationId: number;
  signedPrekey: {
    keyId: number;
    publicKey: Base64;
    signature: Base64;
  };
  oneTimePrekey?: {
    keyId: number;
    publicKey: Base64;
  } | null;
}

/** An encrypted Signal Protocol message envelope. */
export interface EncryptedMessage {
  /** Base64-encoded ciphertext (Signal CiphertextMessage). */
  ciphertext: Base64;
  /**
   * 1 = PreKeySignalMessage (first message to a device — contains key exchange material)
   * 2 = SignalMessage (subsequent messages — Double Ratchet only)
   */
  messageType: 1 | 2;
}

/** A decrypted plaintext payload. */
export interface DecryptedPayload {
  plaintext: Uint8Array;
}

/** Safety number — used for identity verification (like Signal's safety numbers). */
export interface SafetyNumber {
  /** Human-readable 60-digit number shown for manual verification. */
  digits: string;
  /** The raw fingerprint bytes, base64-encoded. */
  fingerprintBytes: Base64;
}
