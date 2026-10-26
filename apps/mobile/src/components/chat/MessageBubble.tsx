/**
 * MessageBubble — renders a single chat message.
 * Theming uses design tokens from the active theme.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@luvora/design-system';
import { spacing, fontSize, radius } from '@luvora/design-system';
import type { DecryptedMessage } from '@luvora/shared-types';
import { formatFullTimestamp } from '../../utils/time';

interface Props {
  message: DecryptedMessage;
  isOwn: boolean;
}

const DELIVERY_ICONS: Record<string, string> = {
  local: '🕐',
  pending: '🕐',
  sending: '🕐',
  sent: '✓',
  delivered: '✓✓',
  read: '💕',
  failed: '⚠️',
};

export function MessageBubble({ message, isOwn }: Props) {
  const { theme } = useTheme();

  if (message.isDeleted) {
    return (
      <View style={[styles.row, isOwn ? styles.rowRight : styles.rowLeft]}>
        <Text style={[styles.deletedText, { color: theme.colors.onSurfaceVariant }]}>
          🗑 Message deleted
        </Text>
      </View>
    );
  }

  const bubbleStyle = isOwn
    ? {
        backgroundColor: theme.colors.sentBubble,
        borderTopRightRadius: theme.bubbles.sentBorderRadius.topRight,
        borderTopLeftRadius: theme.bubbles.sentBorderRadius.topLeft,
        borderBottomLeftRadius: theme.bubbles.sentBorderRadius.bottomLeft,
        borderBottomRightRadius: theme.bubbles.sentBorderRadius.bottomRight,
      }
    : {
        backgroundColor: theme.colors.receivedBubble,
        borderTopRightRadius: theme.bubbles.receivedBorderRadius.topRight,
        borderTopLeftRadius: theme.bubbles.receivedBorderRadius.topLeft,
        borderBottomLeftRadius: theme.bubbles.receivedBorderRadius.bottomLeft,
        borderBottomRightRadius: theme.bubbles.receivedBorderRadius.bottomRight,
      };

  const textColor = isOwn ? theme.colors.sentBubbleText : theme.colors.receivedBubbleText;

  return (
    <View style={[styles.row, isOwn ? styles.rowRight : styles.rowLeft]}>
      <View style={[styles.bubble, bubbleStyle, { maxWidth: `${theme.bubbles.maxWidthFraction * 100}%` as any }]}>
        {/* Edited indicator */}
        {message.isEdited && (
          <Text style={[styles.editedLabel, { color: textColor, opacity: 0.6 }]}>
            edited
          </Text>
        )}

        {/* Text content */}
        {message.text ? (
          <Text
            style={[styles.messageText, { color: textColor }]}
            selectable
          >
            {message.text}
          </Text>
        ) : null}

        {/* Timestamp + delivery state */}
        <View style={styles.meta}>
          <Text style={[styles.timestamp, { color: textColor, opacity: 0.65 }]}>
            {formatFullTimestamp(message.createdAt).split(' · ')[1]}
          </Text>
          {isOwn && (
            <Text style={[styles.deliveryIcon, { opacity: message.deliveryState === 'failed' ? 1 : 0.7 }]}>
              {DELIVERY_ICONS[message.deliveryState] ?? ''}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    minWidth: 60,
  },
  editedLabel: {
    fontSize: fontSize.xs,
    marginBottom: 2,
  },
  messageText: {
    fontSize: fontSize.base,
    lineHeight: fontSize.base * 1.45,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  timestamp: {
    fontSize: fontSize.xs,
  },
  deliveryIcon: {
    fontSize: 11,
  },
  deletedText: {
    fontSize: fontSize.sm,
    fontStyle: 'italic',
    paddingHorizontal: spacing.sm,
  },
});
