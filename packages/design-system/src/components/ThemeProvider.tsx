/**
 * ThemeProvider – wraps the entire app and injects the active LuvoraTheme
 * into React context. All components use `useTheme()` rather than
 * hard-coding color values.
 *
 * Compatible with React Native + Expo (no DOM imports).
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { LuvoraTheme } from '@luvora/shared-types';
import { BUILT_IN_THEMES, DEFAULT_THEME_ID } from '../themes/all-themes';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ThemeContextValue {
  theme: LuvoraTheme;
  themeId: string;
  setThemeId: (id: string) => void;
  /** All available built-in + user-created themes. */
  availableThemes: LuvoraTheme[];
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Override theme (e.g. from persisted settings). Defaults to 'pink-pookie'. */
  initialThemeId?: string;
  /** Optional custom themes added by the user / server. */
  customThemes?: LuvoraTheme[];
}

export function ThemeProvider({
  children,
  initialThemeId = DEFAULT_THEME_ID,
  customThemes = [],
}: ThemeProviderProps) {
  const allThemes: Record<string, LuvoraTheme> = {
    ...BUILT_IN_THEMES,
    ...Object.fromEntries(customThemes.map((t) => [t.id, t])),
  };

  const [themeId, setThemeIdState] = useState<string>(
    allThemes[initialThemeId] ? initialThemeId : DEFAULT_THEME_ID,
  );

  const setThemeId = useCallback(
    (id: string) => {
      if (allThemes[id]) {
        setThemeIdState(id);
      } else {
        console.warn(`[Luvora] Unknown theme id: "${id}". Falling back to default.`);
        setThemeIdState(DEFAULT_THEME_ID);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const theme = allThemes[themeId] ?? allThemes[DEFAULT_THEME_ID]!;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeId,
        setThemeId,
        availableThemes: Object.values(allThemes),
        isDark: theme.isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
