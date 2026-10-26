/**
 * Chat conversation screen.
 * Shows the message list and input bar for a single conversation.
 *
 * Phase 1-3: messages are sent over the socket without E2E encryption.
 * A "Not yet encrypted" banner is shown until Phase 4.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { nanoid } from 'nanoid/non-secure';
import { useTheme } from '@luvora/design-system';
import { spacing, radius } from '@luvora/design-system';
import { useMessages } from '../../../../hooks/useMessages';
import { MessageBubble } from '../../../../components/chat/MessageBubble';
import { useAuthStore } from '../../../../stores/auth-store';
import type { DecryptedMessage } from '@luvora/shared-types';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { userId } = useAuthStore();
  const { messages, isLoading, sendMessage, isSending } = useMessages(id);

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: false });
    }
  }, [messages.length]);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text) return;

    setInputText('');

    try {
      await sendMessage({ type: 'text', text, idempotencyKey: nanoid() });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send message.';
      Alert.alert('Send Error', msg);
      setInputText(text); // restore text on failure
    }
  }, [inputText, sendMessage]);

  const renderItem = ({ item }: { item: DecryptedMessage }) => (
    <Animated.View entering={FadeInDown.duration(200)}>
      <MessageBubble message={item} isOwn={item.senderId === userId} />
    </Animated.View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top', 'bottom']}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.divider, backgroundColor: theme.colors.navigationBar }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={{ color: theme.colors.primary, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
          💬 Chat
        </Text>
        <TouchableOpacity style={styles.headerRight} accessibilityRole="button">
          <Text style={{ fontSize: 20 }}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Dev-only: encryption not yet active banner */}
      <View style={[styles.encryptionBanner, { backgroundColor: theme.colors.warning + '22' }]}>
        <Text style={[styles.encryptionBannerText, { color: theme.colors.warning }]}>
          🔓 Dev mode — E2E encryption not yet active (Phase 4)
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Message list */}
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 48 }}>💬</Text>
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  No messages yet. Say hi! 👋
                </Text>
              </View>
            }
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />
        )}

        {/* Input bar */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: theme.colors.navigationBar,
              borderTopColor: theme.colors.divider,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.inputBackground,
                color: theme.colors.inputText,
                borderColor: theme.colors.inputBorder,
              },
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message…"
            placeholderTextColor={theme.colors.inputPlaceholder}
            multiline
            maxLength={4000}
            accessibilityLabel="Message input"
            onSubmitEditing={Platform.OS === 'ios' ? undefined : handleSend}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor:
                  inputText.trim() ? theme.colors.primary : theme.colors.surfaceVariant,
              },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            {isSending ? (
              <ActivityIndicator color={theme.colors.onPrimary} size="small" />
            ) : (
              <Text style={{ color: theme.colors.onPrimary, fontSize: 18 }}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: { padding: spacing.sm, marginRight: spacing.sm },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '700' },
  headerRight: { padding: spacing.sm },
  encryptionBanner: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
  },
  encryptionBannerText: { fontSize: 11, fontWeight: '600' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  messageList: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing['5xl'],
    gap: spacing.md,
  },
  emptyText: { fontSize: 15, textAlign: 'center' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    fontSize: 16,
    maxHeight: 120,
    minHeight: 42,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
