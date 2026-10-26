/**
 * Root layout – initializes fonts, theme, query client, and auth.
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@luvora/design-system';
import { useAppStore } from '../stores/app-store';
import { queryClient } from '../services/api/query-client';
import { initDatabase } from '../services/storage/database';
import { socketService } from '../services/api/websocket';
import { outboxManager } from '../services/api/outbox-manager';

// Keep the splash screen visible while we fetch resources.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { themeId, isHydrated, hydrateFromStorage, isAuthenticated } = useAppStore();

  useEffect(() => {
    // Initialize local SQLite database
    initDatabase().catch((err) => console.error('[DB] Init failed:', err));

    // Load persisted settings from secure storage / MMKV.
    hydrateFromStorage().finally(() => {
      SplashScreen.hideAsync();
    });
  }, [hydrateFromStorage]);

  // Connect / disconnect socket when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect();
      outboxManager.start();
    } else {
      socketService.disconnect();
      outboxManager.stop();
    }
    return () => {
      outboxManager.stop();
    };
  }, [isAuthenticated]);

  if (!isHydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider initialThemeId={themeId}>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(main)" />
            </Stack>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
