/**
 * Chats list screen – shows all conversations sorted by last message.
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@luvora/design-system';
import { spacing } from '@luvora/design-system';
import { useConversations } from '../../../hooks/useConversations';
import { ConversationRow } from '../../../components/chat/ConversationRow';
import type { Conversation } from '@luvora/shared-types';

export default function ChatsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { conversations, isLoading, refetch } = useConversations();

  const handlePress = useCallback(
    (conv: Conversation) => {
      router.push(`/(main)/chats/${conv.id}`);
    },
    [router],
  );

  const handleNewChat = () => {
    router.push('/(main)/chats/new');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.divider }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
          💌 Chats
        </Text>
        <TouchableOpacity
          onPress={handleNewChat}
          style={[styles.newChatButton, { backgroundColor: theme.colors.primary }]}
          accessibilityRole="button"
          accessibilityLabel="Start new chat"
        >
          <Text style={{ color: theme.colors.onPrimary, fontSize: 22 }}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Conversation list */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationRow conversation={item} onPress={() => handlePress(item)} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.onBackground }]}>
                No conversations yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
                Tap the pencil button to start a new chat.
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={conversations.length === 0 ? styles.emptyList : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing['5xl'],
    paddingHorizontal: spacing['3xl'],
  },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.base },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: spacing.sm },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
  emptyList: { flex: 1 },
});
