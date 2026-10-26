/**
 * Auth store – login, register, logout, token refresh.
 * Tokens stored in SecureStore (iOS Keychain / Android Keystore).
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../services/api/client';
import { useAppStore } from './app-store';
import type { AuthTokens } from '@luvora/shared-types';

const ACCESS_TOKEN_KEY = 'luvora_access_token';
const REFRESH_TOKEN_KEY = 'luvora_refresh_token';

interface RegisterParams {
  username: string;
  displayName: string;
  email: string;
  password: string;
}

interface LoginParams {
  identifier: string;
  password: string;
}

interface AuthStore {
  isLoading: boolean;
  accessToken: string | null;
  userId: string | null;

  register: (params: RegisterParams) => Promise<void>;
  login: (params: LoginParams) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  loadTokens: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoading: false,
  accessToken: null,
  userId: null,

  register: async ({ username, displayName, email, password }) => {
    set({ isLoading: true });
    try {
      /**
       * NOTE: In Phase 4, before calling the API, we generate a device identity
       * key pair here using the cryptography-adapter package and upload the
       * public key alongside the registration. For Phase 1 MVP, we scaffold
       * the call structure without the real key generation.
       */
      const response = await apiClient.post<{ tokens: AuthTokens; userId: string }>(
        '/auth/register',
        { username, displayName, email, password },
      );

      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.tokens.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.tokens.refreshToken);

      set({ accessToken: response.tokens.accessToken, userId: response.userId });
      useAppStore.getState().setAuthenticated(true);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async ({ identifier, password }) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post<{ tokens: AuthTokens; userId: string }>(
        '/auth/login',
        { identifier, password },
      );

      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.tokens.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.tokens.refreshToken);

      set({ accessToken: response.tokens.accessToken, userId: response.userId });
      useAppStore.getState().setAuthenticated(true);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    set({ accessToken: null, userId: null });
    useAppStore.getState().setAuthenticated(false);
  },

  refreshTokens: async () => {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!refreshToken) return false;

    try {
      const response = await apiClient.post<AuthTokens>('/auth/refresh', { refreshToken });
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refreshToken);
      set({ accessToken: response.accessToken });
      return true;
    } catch {
      get().logout();
      return false;
    }
  },

  loadTokens: async () => {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    if (accessToken) {
      set({ accessToken });
    }
  },
}));
