import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@luvora/design-system';
import { spacing, radius } from '@luvora/design-system';
import { useAuthStore } from '../stores/auth-store';

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { login, isLoading } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter your username/email and password.');
      return;
    }

    try {
      await login({ identifier: identifier.trim(), password });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      Alert.alert('Login Error', message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={{ color: theme.colors.primary, fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          Welcome back 💝
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Log in to continue your story.
        </Text>

        <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
          Username or Email
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.inputBackground,
              borderColor: theme.colors.inputBorder,
              color: theme.colors.inputText,
            },
          ]}
          value={identifier}
          onChangeText={setIdentifier}
          placeholder="yourname or you@example.com"
          placeholderTextColor={theme.colors.inputPlaceholder}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Username or email"
        />

        <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Password</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.inputBackground,
              borderColor: theme.colors.inputBorder,
              color: theme.colors.inputText,
            },
          ]}
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          placeholderTextColor={theme.colors.inputPlaceholder}
          secureTextEntry
          accessibilityLabel="Password"
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isLoading ? theme.colors.primaryVariant : theme.colors.primary },
          ]}
          onPress={handleLogin}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Log in"
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.onPrimary} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // TODO: forgot password flow
            Alert.alert('Reset Password', 'Password reset flow coming soon.');
          }}
          style={styles.forgotButton}
          accessibilityRole="button"
          accessibilityLabel="Forgot password"
        >
          <Text style={{ color: theme.colors.primary, fontSize: 14 }}>Forgot password?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['3xl'],
    paddingBottom: spacing['3xl'],
  },
  backButton: { marginBottom: spacing.base },
  title: { fontSize: 28, fontWeight: '800', marginBottom: spacing.xs },
  subtitle: { fontSize: 15, marginBottom: spacing['2xl'] },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  button: {
    borderRadius: radius.lg,
    paddingVertical: spacing.base,
    alignItems: 'center',
    marginTop: spacing['2xl'],
    marginBottom: spacing.base,
  },
  buttonText: { fontSize: 17, fontWeight: '700' },
  forgotButton: { alignItems: 'center', marginTop: spacing.sm },
});
