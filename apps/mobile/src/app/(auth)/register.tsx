/**
 * Registration screen.
 * Creates account, generates device identity key pair, uploads public key.
 */

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

export default function RegisterScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { register, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = (): boolean => {
    const newErrors: Partial<typeof form> = {};

    if (!form.username || form.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username = 'Only letters, numbers, and underscores';
    }

    if (!form.displayName || form.displayName.length < 1) {
      newErrors.displayName = 'Please enter your name';
    }

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!form.password || form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await register({
        username: form.username,
        displayName: form.displayName,
        email: form.email,
        password: form.password,
      });
      // On success, app-store state change will redirect to (main)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      Alert.alert('Registration Error', message);
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.colors.inputBackground,
      borderColor: theme.colors.inputBorder,
      color: theme.colors.inputText,
    },
  ];

  const labelStyle = [styles.label, { color: theme.colors.onSurfaceVariant }];
  const errorStyle = [styles.errorText, { color: theme.colors.error }];

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
          Create your account 🌸
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Join Luvora and start your story.
        </Text>

        {/* Username */}
        <Text style={labelStyle}>Username</Text>
        <TextInput
          style={inputStyle}
          value={form.username}
          onChangeText={(v) => setForm((p) => ({ ...p, username: v.toLowerCase().trim() }))}
          placeholder="yourname"
          placeholderTextColor={theme.colors.inputPlaceholder}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={30}
          accessibilityLabel="Username"
        />
        {errors.username ? <Text style={errorStyle}>{errors.username}</Text> : null}

        {/* Display Name */}
        <Text style={labelStyle}>Display Name</Text>
        <TextInput
          style={inputStyle}
          value={form.displayName}
          onChangeText={(v) => setForm((p) => ({ ...p, displayName: v }))}
          placeholder="Your Name"
          placeholderTextColor={theme.colors.inputPlaceholder}
          maxLength={50}
          accessibilityLabel="Display name"
        />
        {errors.displayName ? <Text style={errorStyle}>{errors.displayName}</Text> : null}

        {/* Email */}
        <Text style={labelStyle}>Email</Text>
        <TextInput
          style={inputStyle}
          value={form.email}
          onChangeText={(v) => setForm((p) => ({ ...p, email: v.trim() }))}
          placeholder="you@example.com"
          placeholderTextColor={theme.colors.inputPlaceholder}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Email address"
        />
        {errors.email ? <Text style={errorStyle}>{errors.email}</Text> : null}

        {/* Password */}
        <Text style={labelStyle}>Password</Text>
        <TextInput
          style={inputStyle}
          value={form.password}
          onChangeText={(v) => setForm((p) => ({ ...p, password: v }))}
          placeholder="At least 8 characters"
          placeholderTextColor={theme.colors.inputPlaceholder}
          secureTextEntry
          accessibilityLabel="Password"
        />
        {errors.password ? <Text style={errorStyle}>{errors.password}</Text> : null}

        {/* Confirm Password */}
        <Text style={labelStyle}>Confirm Password</Text>
        <TextInput
          style={inputStyle}
          value={form.confirmPassword}
          onChangeText={(v) => setForm((p) => ({ ...p, confirmPassword: v }))}
          placeholder="Repeat your password"
          placeholderTextColor={theme.colors.inputPlaceholder}
          secureTextEntry
          accessibilityLabel="Confirm password"
        />
        {errors.confirmPassword ? (
          <Text style={errorStyle}>{errors.confirmPassword}</Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isLoading ? theme.colors.primaryVariant : theme.colors.primary },
          ]}
          onPress={handleRegister}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Create account"
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.onPrimary} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>
              Create Account
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.privacyNote}>
          <Text style={[styles.privacyText, { color: theme.colors.onSurfaceVariant }]}>
            🔒 Your messages are end-to-end encrypted. We generate a unique encryption key on your
            device — we cannot read your conversations.
          </Text>
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: spacing['2xl'],
  },
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
  errorText: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  button: {
    borderRadius: radius.lg,
    paddingVertical: spacing.base,
    alignItems: 'center',
    marginTop: spacing['2xl'],
    marginBottom: spacing.base,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
  },
  privacyNote: {
    marginTop: spacing.base,
  },
  privacyText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
