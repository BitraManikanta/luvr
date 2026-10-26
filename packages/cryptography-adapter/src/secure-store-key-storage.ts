/**
 * React Native / Expo implementation of KeyStorageInterface.
 *
 * Uses:
 * - expo-secure-store → iOS Keychain / Android Keystore for secret key material
 * - expo-sqlite (via the database service) → Signal session and prekey records
 *
 * This class is imported ONLY by the mobile app. The API backend uses
 * NodeKeyStorage instead.
 */

import * as SecureStore from 'expo-secure-store';
import type { KeyStorageInterface, SignalSessionStore, SignalIdentityStore, SignalPreKeyStore, SignalSignedPreKeyStore } from './key-storage';

const KEYS = {
  IDENTITY_PUBLIC: 'luvora_identity_public',
  IDENTITY_PRIVATE: 'luvora_identity_private',
  REGISTRATION_ID: 'luvora_registration_id',
};

export class SecureStoreKeyStorage implements KeyStorageInterface {
  async saveIdentityKeyPair(publicKey: string, privateKey: string): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.IDENTITY_PUBLIC, publicKey, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      }),
      SecureStore.setItemAsync(KEYS.IDENTITY_PRIVATE, privateKey, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      }),
    ]);
  }

  async getIdentityPublicKey(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.IDENTITY_PUBLIC);
  }

  async getRegistrationId(): Promise<number | null> {
    const val = await SecureStore.getItemAsync(KEYS.REGISTRATION_ID);
    return val ? parseInt(val, 10) : null;
  }

  async saveRegistrationId(id: number): Promise<void> {
    await SecureStore.setItemAsync(KEYS.REGISTRATION_ID, String(id), {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }

  async saveSignedPrekey(
    keyId: number,
    publicKey: string,
    privateKey: string,
    signature: string,
  ): Promise<void> {
    await SecureStore.setItemAsync(
      `luvora_spk_${keyId}`,
      JSON.stringify({ publicKey, privateKey, signature }),
      { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY },
    );
  }

  async getSignedPrekey(keyId: number) {
    const val = await SecureStore.getItemAsync(`luvora_spk_${keyId}`);
    if (!val) return null;
    return JSON.parse(val) as { publicKey: string; privateKey: string; signature: string };
  }

  async saveOneTimePrekey(keyId: number, publicKey: string, privateKey: string): Promise<void> {
    await SecureStore.setItemAsync(
      `luvora_otpk_${keyId}`,
      JSON.stringify({ publicKey, privateKey }),
      { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY },
    );
  }

  async getOneTimePrekey(keyId: number) {
    const val = await SecureStore.getItemAsync(`luvora_otpk_${keyId}`);
    if (!val) return null;
    return JSON.parse(val) as { publicKey: string; privateKey: string };
  }

  async removeOneTimePrekey(keyId: number): Promise<void> {
    await SecureStore.deleteItemAsync(`luvora_otpk_${keyId}`);
  }

  async clearAll(): Promise<void> {
    const toDelete = [
      KEYS.IDENTITY_PUBLIC,
      KEYS.IDENTITY_PRIVATE,
      KEYS.REGISTRATION_ID,
    ];
    await Promise.all(toDelete.map((k) => SecureStore.deleteItemAsync(k)));
  }

  // Signal protocol store stubs — full SQLite implementations wired in Phase 4 completion
  async getSignalSessionStore(): Promise<SignalSessionStore> {
    throw new Error('Signal session store not yet implemented. Phase 4.');
  }
  async getSignalIdentityStore(): Promise<SignalIdentityStore> {
    throw new Error('Signal identity store not yet implemented. Phase 4.');
  }
  async getSignalPreKeyStore(): Promise<SignalPreKeyStore> {
    throw new Error('Signal pre-key store not yet implemented. Phase 4.');
  }
  async getSignalSignedPreKeyStore(): Promise<SignalSignedPreKeyStore> {
    throw new Error('Signal signed pre-key store not yet implemented. Phase 4.');
  }
}
