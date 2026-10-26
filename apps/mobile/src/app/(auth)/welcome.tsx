/**
 * Welcome / onboarding screen – first screen new users see.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeInDown,
} from 'react-native-reanimated';
import { useTheme } from '@luvora/design-system';
import { spacing } from '@luvora/design-system';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const heartScale = useSharedValue(0);

  React.useEffect(() => {
    heartScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 120 }));
  }, [heartScale]);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <LinearGradient
      colors={theme.background.gradient ?? [theme.colors.background, theme.colors.surfaceVariant]}
      style={styles.container}
    >
      {/* Decorative floating hearts */}
      <View style={styles.decorativeContainer} pointerEvents="none">
        {['❤️', '🩷', '💕', '💝', '💗'].map((emoji, i) => (
          <Animated.Text
            key={i}
            entering={FadeInDown.delay(i * 200).duration(800)}
            style={[
              styles.floatingHeart,
              {
                left: `${15 + i * 17}%` as any,
                top: `${10 + (i % 3) * 8}%` as any,
                opacity: 0.3 + i * 0.1,
              },
            ]}
          >
            {emoji}
          </Animated.Text>
        ))}
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo / wordmark */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)}>
          <Animated.Text style={[styles.heartIcon, heartStyle]}>💌</Animated.Text>
          <Text style={[styles.appName, { color: theme.colors.primary }]}>Luvora</Text>
          <Text style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>
            Where love lives, grows, and shines. ✨
          </Text>
        </Animated.View>

        {/* Feature highlights */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.features}>
          {[
            { icon: '🔒', label: 'End-to-end encrypted chats' },
            { icon: '🎮', label: 'Couple games & activities' },
            { icon: '📸', label: 'Stories, reels & memories' },
            { icon: '🤖', label: 'Private AI companion' },
          ].map(({ icon, label }) => (
            <View key={label} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{icon}</Text>
              <Text style={[styles.featureLabel, { color: theme.colors.onSurfaceVariant }]}>
                {label}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* CTA buttons */}
        <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.buttons}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Create an account"
          >
            <Text style={[styles.primaryButtonText, { color: theme.colors.onPrimary }]}>
              Get Started 🌸
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Log in to existing account"
          >
            <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
              I already have an account
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(900).duration(600)}
          style={[styles.legal, { color: theme.colors.onSurfaceVariant }]}
        >
          By continuing you agree to our{' '}
          <Text style={{ color: theme.colors.primary }}>Terms</Text> and{' '}
          <Text style={{ color: theme.colors.primary }}>Privacy Policy</Text>.
        </Animated.Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  floatingHeart: {
    position: 'absolute',
    fontSize: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['6xl'],
    paddingBottom: spacing['3xl'],
  },
  heartIcon: {
    fontSize: 72,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  appName: {
    fontSize: 48,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing['2xl'],
  },
  features: {
    width: '100%',
    marginBottom: spacing['2xl'],
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    fontSize: 22,
    width: 32,
    textAlign: 'center',
  },
  featureLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  buttons: {
    width: '100%',
    gap: spacing.md,
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: spacing.base,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FF85A1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: spacing.base,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  legal: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.base,
  },
});
