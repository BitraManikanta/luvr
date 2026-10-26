/**
 * KeyStorageInterface — the contract between the Signal adapter and platform storage.
 *
 * Each platform (React Native via SecureStore/SQLite, Node.js via encrypted files)
 * provides its own implementation of this interface.
 * The adapter never accesses storage directly — it always goes through this interface.
 */

/**
 * Minimal signal-protocol store interfaces.
 * The actual types come from @signalapp/libsignal-client but we keep this
 * abstraction so the adapter compiles without the native module in test environments.
 */
export interface SignalSessionStore {
  getSession(address: unknown): Promise<unknown>;
  saveSession(address: unknown, record: unknown): Promise<void>;
}

export interface SignalIdentityStore {
  getIdentityKey(): Promise<unknown>;
  getLocalRegistrationId(): Promise<number>;
  saveIdentity(address: unknown, publicKey: unknown): Promise<boolean>;
  isTrustedIdentity(address: unknown, publicKey: unknown, direction: unknown): Promise<boolean>;
}

export interface SignalPreKeyStore {
  getPreKey(id: number): Promise<unknown>;
  savePreKey(id: number, record: unknown): Promise<void>;
  removePreKey(id: number): Promise<void>;
}

export interface SignalSignedPreKeyStore {
  getSignedPreKey(id: number): Promise<unknown>;
  saveSignedPreKey(id: number, record: unknown): Promise<void>;
}

/**
 * Main key storage interface implemented by each platform.
 */
export interface KeyStorageInterface {
  /** Persist the device's identity key pair (encrypted). */
  saveIdentityKeyPair(publicKey: string, privateKey: string): Promise<void>;

  /** Retrieve the identity public key. */
  getIdentityPublicKey(): Promise<string | null>;

  /** Retrieve the registration ID. */
  getRegistrationId(): Promise<number | null>;

  /** Persist registration ID. */
  saveRegistrationId(id: number): Promise<void>;

  /** Signed prekey storage. */
  saveSignedPrekey(keyId: number, publicKey: string, privateKey: string, signature: string): Promise<void>;
  getSignedPrekey(keyId: number): Promise<{ publicKey: string; privateKey: string; signature: string } | null>;

  /** One-time prekey storage. */
  saveOneTimePrekey(keyId: number, publicKey: string, privateKey: string): Promise<void>;
  getOneTimePrekey(keyId: number): Promise<{ publicKey: string; privateKey: string } | null>;
  removeOneTimePrekey(keyId: number): Promise<void>;

  /** Signal protocol store accessors (returns platform-specific implementations). */
  getSignalSessionStore(): Promise<SignalSessionStore>;
  getSignalIdentityStore(): Promise<SignalIdentityStore>;
  getSignalPreKeyStore(): Promise<SignalPreKeyStore>;
  getSignalSignedPreKeyStore(): Promise<SignalSignedPreKeyStore>;

  /** Clear all key material (on logout / account deletion). */
  clearAll(): Promise<void>;
}
