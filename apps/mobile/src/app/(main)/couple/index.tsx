import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@luvora/design-system';
import { spacing } from '@luvora/design-system';

export default function CoupleScreen() {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>💕 Us</Text>
      </View>
      <View style={styles.placeholder}>
        <Text style={{ fontSize: 48 }}>💝</Text>
        <Text style={[styles.placeholderText, { color: theme.colors.onSurfaceVariant }]}>
          Anniversaries, memories, games, and love letters — coming in Phase 6.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  title: { fontSize: 24, fontWeight: '800' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing['3xl'] },
  placeholderText: { fontSize: 15, textAlign: 'center', marginTop: spacing.base },
});
