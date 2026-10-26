/**
 * A single row in the conversations list.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '@luvora/design-system';
import { spacing } from '@luvora/design-system';
import type { Conversation } from '@luvora/shared-types';
import { formatRelativeTime } from '../../utils/time';

interface Props {
  conversation: Conversation;
  onPress: () => void;
}

const DELIVERY_STATE_ICONS: Record<string, string> = {
  local: '🕐',
  pending: '🕐',
  sending: '🕐',
  sent: '✓',
  delivered: '✓✓',
  read: '💕',
  failed: '⚠️',
};

export function ConversationRow({ conversation, onPress }: Props) {
  const { theme } = useTheme();

  const title =
    conversation.type === 'direct'
      ? conversation.participants[0]?.userId ?? 'Unknown'
      : (conversation.name ?? 'Group');

  const lastMsg = conversation.lastMessage;
  const preview = lastMsg?.isDeleted
    ? 'Message deleted'
    : lastMsg?.text ?? (lastMsg?.attachments?.length ? '📎 Attachment' : '');

  const deliveryIcon = lastMsg
    ? (DELIVERY_STATE_ICONS[lastMsg.deliveryState] ?? '')
    : '';

  const hasUnread = conversation.unreadCount > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.row, { borderBottomColor: theme.colors.divider }]}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Conversation with ${title}`}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: theme.colors.primaryVariant }]}>
        {conversation.avatarUrl ? (
          <Image source={{ uri: conversation.avatarUrl }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarEmoji}>
            {conversation.type === 'group' ? '👥' : '👤'}
          </Text>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            style={[
              styles.name,
              { color: theme.colors.onSurface },
              hasUnread && { fontWeight: '800' },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {lastMsg && (
            <Text style={[styles.time, { color: theme.colors.onSurfaceVariant }]}>
              {formatRelativeTime(lastMsg.createdAt)}
            </Text>
          )}
        </View>

        <View style={styles.bottomRow}>
          <Text
            style={[
              styles.preview,
              { color: hasUnread ? theme.colors.onSurface : theme.colors.onSurfaceVariant },
              hasUnread && { fontWeight: '600' },
            ]}
            numberOfLines={1}
          >
            {deliveryIcon ? `${deliveryIcon} ` : ''}{preview || 'No messages yet'}
          </Text>
          {hasUnread && (
            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.badgeText, { color: theme.colors.onPrimary }]}>
                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  avatarImage: { width: 52, height: 52, borderRadius: 26 },
  avatarEmoji: { fontSize: 22 },
  content: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: { fontSize: 16, fontWeight: '600', flex: 1 },
  time: { fontSize: 12, marginLeft: spacing.sm },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preview: { fontSize: 14, flex: 1 },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginLeft: spacing.sm,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
});
