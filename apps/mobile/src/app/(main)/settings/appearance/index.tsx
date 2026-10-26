/**
 * Appearance & Themes screen.
 * Lets users choose from all 12 built-in themes with a live preview.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, BUILT_IN_THEMES } from '@luvora/design-system';
import { spacing, radius } from '@luvora/design-system';
import { useAppStore } from '../../../../stores/app-store';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - spacing.base * 2 - spacing.md * 2) / 3;

export default function AppearanceScreen() {
  const { theme, themeId, setThemeId } = useTheme();
  const router = useRouter();
  const { setThemeId: persistThemeId } = useAppStore();

  const handleSelectTheme = (id: string) => {
    setThemeId(id);
    persistThemeId(id);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <View style={[styles.header, { borderBottomColor: theme.colors.divider }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={{ color: theme.colors.primary, fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>Themes</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Live preview bubble */}
      <View style={[styles.preview, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View
          style={[
            styles.bubble,
            styles.bubbleReceived,
            { backgroundColor: theme.colors.receivedBubble },
          ]}
        >
          <Text style={[styles.bubbleText, { color: theme.colors.receivedBubbleText }]}>
            I love you so much! 💕
          </Text>
        </View>
        <View
          style={[
            styles.bubble,
            styles.bubbleSent,
            { backgroundColor: theme.colors.sentBubble },
          ]}
        >
          <Text style={[styles.bubbleText, { color: theme.colors.sentBubbleText }]}>
            I love you more! 🥰
          </Text>
        </View>
        <Text style={[styles.previewLabel, { color: theme.colors.onSurfaceVariant }]}>
          Live preview – {theme.name}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
          Built-in Themes
        </Text>
        <View style={styles.row}>
          {Object.values(BUILT_IN_THEMES).map((t) => {
            const isSelected = t.id === themeId;
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => handleSelectTheme(t.id)}
                style={[
                  styles.card,
                  isSelected && { borderColor: theme.colors.primary, borderWidth: 2.5 },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Select ${t.name} theme`}
                accessibilityState={{ selected: isSelected }}
              >
                <LinearGradient
                  colors={t.previewGradient as [string, string, ...string[]]}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                {isSelected && (
                  <View style={[styles.checkmark, { backgroundColor: theme.colors.primary }]}>
                    <Text style={{ color: theme.colors.onPrimary, fontSize: 10, fontWeight: '700' }}>
                      ✓
                    </Text>
                  </View>
                )}
                <Text
                  style={[styles.cardName, { color: t.isDark ? '#FFFFFF' : '#1A1A1A' }]}
                  numberOfLines={2}
                >
                  {t.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
  headerTitle: { fontSize: 18, fontWeight: '700' },
  preview: {
    margin: spacing.base,
    borderRadius: radius.lg,
    padding: spacing.base,
    gap: spacing.sm,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  bubbleReceived: { alignSelf: 'flex-start', borderTopLeftRadius: 4 },
  bubbleSent: { alignSelf: 'flex-end', borderTopRightRadius: 4 },
  bubbleText: { fontSize: 14, fontWeight: '500' },
  previewLabel: { fontSize: 11, textAlign: 'center', marginTop: spacing.xs },
  grid: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.15,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cardGradient: { ...StyleSheet.absoluteFillObject },
  cardName: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    fontSize: 11,
    fontWeight: '700',
  },
  checkmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
