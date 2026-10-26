/**
 * App-level Zustand store – hydration, theme, and global state.
 */

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'luvora-app-store' });

interface AppStore {
  // Hydration
  isHydrated: boolean;
  hydrateFromStorage: () => Promise<void>;

  // Auth
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;

  // Theme
  themeId: string;
  setThemeId: (id: string) => void;

  // Connectivity
  isOnline: boolean;
  setOnline: (v: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isHydrated: false,
  isAuthenticated: false,
  themeId: 'pink-pookie',
  isOnline: true,

  hydrateFromStorage: async () => {
    try {
      const themeId = storage.getString('themeId') ?? 'pink-pookie';
      const isAuthenticated = storage.getBoolean('isAuthenticated') ?? false;
      set({ themeId, isAuthenticated, isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },

  setAuthenticated: (v) => {
    storage.set('isAuthenticated', v);
    set({ isAuthenticated: v });
  },

  setThemeId: (id) => {
    storage.set('themeId', id);
    set({ themeId: id });
  },

  setOnline: (v) => set({ isOnline: v }),
}));
