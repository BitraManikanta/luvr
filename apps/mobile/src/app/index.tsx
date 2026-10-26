/**
 * Root index – redirect based on authentication state.
 */

import { Redirect } from 'expo-router';
import { useAppStore } from '../stores/app-store';

export default function Index() {
  const { isAuthenticated } = useAppStore();

  if (isAuthenticated) {
    return <Redirect href="/(main)/chats" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
