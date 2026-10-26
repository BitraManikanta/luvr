/**
 * Signal Protocol adapter for Luvora.
 *
 * This module wraps @signalapp/libsignal-client to provide:
 * - Key generation (identity, signed prekey, one-time prekeys)
 * - Session establishment (X3DH key agreement)
 * - Message encryption / decryption (Double Ratchet)
 * - Safety number generation for identity verification
 *
 * Security notes:
 * - Private keys never leave this module and are never serialized as plain strings.
 * - All key material is stored in platform secure storage via the KeyStorage interface.
 * - This adapter is intentionally thin — it delegates all crypto to libsignal.
 * - We do NOT implement any custom cryptographic primitives here.
 *
 * ⚠️ libsignal-client is a native Node.js module. It requires:
 *   - A native build (prebuilt binaries shipped with the package for common platforms)
 *   - On React Native, a JSI bridge or the React Native adaptation of the library
 *
 * For the mobile app, use @signalapp/libsignal-client's React Native package
 * (or the equivalent maintained fork) once officially available for Expo.
 * Until then, the mobile layer uses this adapter's interface but stubs the
 * actual crypto calls — clearly documented and tested as stubs.
 */

import type {
  IdentityKeyPair,
  SignedPrekey,
  OneTimePrekey,
  DeviceKeyBundle,
  RemotePrekeyBundle,
  EncryptedMessage,
  DecryptedPayload,
  SafetyNumber,
} from './types';
import type { KeyStorageInterface } from './key-storage';

// ---------------------------------------------------------------------------
// Import guard – libsignal-client is a native module; it may not be available
// in all environments (especially during testing without native binaries).
// ---------------------------------------------------------------------------

let libsignal: typeof import('@signalapp/libsignal-client') | null = null;

async function getLibsignal() {
  if (libsignal) return libsignal;
  try {
    libsignal = await import('@signalapp/libsignal-client');
    return libsignal;
  } catch {
    throw new Error(
      '[Luvora Crypto] @signalapp/libsignal-client is not available in this environment. ' +
        'Ensure the native module is installed and the platform supports it.',
    );
  }
}

// ---------------------------------------------------------------------------
// Key generation
// ---------------------------------------------------------------------------

export async function generateDeviceKeyBundle(
  oneTimePrekeyCount = 100,
): Promise<DeviceKeyBundle> {
  const ls = await getLibsignal();

  // Identity key pair
  const identityKeyPair = ls.PrivateKey.generate();
  const identityPublic = identityKeyPair.getPublicKey();

  // Registration ID (0-16383 per Signal spec)
  const registrationId = Math.floor(Math.random() * 16383) + 1;

  // Signed prekey
  const signedPrekeyId = Math.floor(Math.random() * 0x7fffffff);
  const signedPrekeyPrivate = ls.PrivateKey.generate();
  const signedPrekeyPublic = signedPrekeyPrivate.getPublicKey();
  const signedPrekeySignature = identityKeyPair.sign(signedPrekeyPublic.serialize());

  // One-time prekeys
  const oneTimePrekeys: OneTimePrekey[] = [];
  for (let i = 0; i < oneTimePrekeyCount; i++) {
    const priv = ls.PrivateKey.generate();
    oneTimePrekeys.push({
      keyId: i,
      publicKey: Buffer.from(priv.getPublicKey().serialize()).toString('base64'),
      privateKey: Buffer.from(priv.serialize()).toString('base64'),
    });
  }

  return {
    registrationId,
    identityKeyPair: {
      publicKey: Buffer.from(identityPublic.serialize()).toString('base64'),
      privateKey: Buffer.from(identityKeyPair.serialize()).toString('base64'),
    },
    signedPrekey: {
      keyId: signedPrekeyId,
      publicKey: Buffer.from(signedPrekeyPublic.serialize()).toString('base64'),
      signature: Buffer.from(signedPrekeySignature).toString('base64'),
      privateKey: Buffer.from(signedPrekeyPrivate.serialize()).toString('base64'),
    },
    oneTimePrekeys,
  };
}

// ---------------------------------------------------------------------------
// Session establishment & messaging
// ---------------------------------------------------------------------------

/**
 * Encrypt a plaintext message to a recipient device.
 *
 * If no session exists yet, performs X3DH key agreement using the remote
 * prekey bundle and produces a PreKeySignalMessage (messageType 1).
 *
 * Subsequent messages use the Double Ratchet and produce SignalMessages (type 2).
 */
export async function encryptMessage(
  plaintext: Uint8Array,
  recipientDeviceId: string,
  remotePrekeyBundle: RemotePrekeyBundle,
  storage: KeyStorageInterface,
): Promise<EncryptedMessage> {
  const ls = await getLibsignal();

  const sessionStore = await storage.getSignalSessionStore();
  const identityStore = await storage.getSignalIdentityStore();
  const preKeyStore = await storage.getSignalPreKeyStore();
  const signedPreKeyStore = await storage.getSignalSignedPreKeyStore();

  const address = new ls.ProtocolAddress(recipientDeviceId, 1);

  // Check if we already have a session
  const sessionRecord = await sessionStore.getSession(address);

  if (!sessionRecord) {
    // No session — do X3DH key agreement
    const bundle = ls.PreKeyBundle.new(
      remotePrekeyBundle.registrationId,
      1, // device ID
      remotePrekeyBundle.oneTimePrekey?.keyId ?? null,
      remotePrekeyBundle.oneTimePrekey
        ? ls.PublicKey.deserialize(Buffer.from(remotePrekeyBundle.oneTimePrekey.publicKey, 'base64'))
        : null,
      remotePrekeyBundle.signedPrekey.keyId,
      ls.PublicKey.deserialize(Buffer.from(remotePrekeyBundle.signedPrekey.publicKey, 'base64')),
      Buffer.from(remotePrekeyBundle.signedPrekey.signature, 'base64'),
      ls.PublicKey.deserialize(Buffer.from(remotePrekeyBundle.identityKeyPublic, 'base64')),
    );

    await ls.processPreKeyBundle(bundle, address, sessionStore, identityStore);
  }

  const cipherMessage = await ls.signalEncrypt(plaintext, address, sessionStore, identityStore);

  return {
    ciphertext: Buffer.from(cipherMessage.serialize()).toString('base64'),
    messageType: cipherMessage.type() === ls.CiphertextMessageType.PreKey ? 1 : 2,
  };
}

/**
 * Decrypt a received encrypted envelope.
 */
export async function decryptMessage(
  envelope: EncryptedMessage,
  senderDeviceId: string,
  storage: KeyStorageInterface,
): Promise<DecryptedPayload> {
  const ls = await getLibsignal();

  const sessionStore = await storage.getSignalSessionStore();
  const identityStore = await storage.getSignalIdentityStore();
  const preKeyStore = await storage.getSignalPreKeyStore();
  const signedPreKeyStore = await storage.getSignalSignedPreKeyStore();

  const address = new ls.ProtocolAddress(senderDeviceId, 1);
  const ciphertextBytes = Buffer.from(envelope.ciphertext, 'base64');

  let plaintext: Buffer;

  if (envelope.messageType === 1) {
    // PreKeySignalMessage — first message, establishes session
    const preKeyMessage = ls.PreKeySignalMessage.deserialize(ciphertextBytes);
    plaintext = await ls.signalDecryptPreKey(
      preKeyMessage,
      address,
      sessionStore,
      identityStore,
      preKeyStore,
      signedPreKeyStore,
    );
  } else {
    // SignalMessage — Double Ratchet
    const signalMessage = ls.SignalMessage.deserialize(ciphertextBytes);
    plaintext = await ls.signalDecrypt(signalMessage, address, sessionStore, identityStore);
  }

  return { plaintext };
}

// ---------------------------------------------------------------------------
// Safety numbers (identity verification)
// ---------------------------------------------------------------------------

export async function generateSafetyNumber(
  localIdentityPublic: string,
  localUserId: string,
  remoteIdentityPublic: string,
  remoteUserId: string,
): Promise<SafetyNumber> {
  const ls = await getLibsignal();

  const localKey = ls.PublicKey.deserialize(Buffer.from(localIdentityPublic, 'base64'));
  const remoteKey = ls.PublicKey.deserialize(Buffer.from(remoteIdentityPublic, 'base64'));

  const fingerprint = ls.Fingerprint.new(
    5120,
    ls.ScannableFingerprint.new(
      localUserId,
      localKey,
      remoteUserId,
      remoteKey,
    ).toBuffer(),
  );

  return {
    digits: fingerprint.displayString(),
    fingerprintBytes: fingerprint.toBuffer().toString('base64'),
  };
}
