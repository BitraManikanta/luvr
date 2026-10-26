import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@luvora/design-system';
import { spacing, radius } from '@luvora/design-system';
import { useAuthStore } from '../../../stores/auth-store';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>👤 Profile</Text>
      </View>

      <View style={styles.content}>
        {/* Theme link */}
        <TouchableOpacity
          style={[styles.menuItem, { borderColor: theme.colors.divider }]}
          onPress={() => router.push('/(main)/settings/appearance')}
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 22 }}>🎨</Text>
          <Text style={[styles.menuLabel, { color: theme.colors.onSurface }]}>Appearance & Themes</Text>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { borderColor: theme.colors.divider }]}
          onPress={() => Alert.alert('Privacy', 'Privacy settings coming in Phase 11.')}
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 22 }}>🔒</Text>
          <Text style={[styles.menuLabel, { color: theme.colors.onSurface }]}>Privacy & Security</Text>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: theme.colors.error + '15', borderColor: theme.colors.error + '40' }]}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Text style={[styles.logoutText, { color: theme.colors.error }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  title: { fontSize: 24, fontWeight: '800' },
  content: { padding: spacing.base, gap: spacing.sm },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.base,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '500' },
  logoutButton: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.base,
    alignItems: 'center',
    marginTop: spacing.base,
  },
  logoutText: { fontSize: 16, fontWeight: '700' },
});
