'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '../../lib/supabase/server';

// ─── Validation schemas ────────────────────────────────────────────────────

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be 30 characters or less')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must be 50 characters or less'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type AuthFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

// ─── Sign Up ──────────────────────────────────────────────────────────────

export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
    username: formData.get('username'),
    displayName: formData.get('displayName'),
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email, password, username, displayName } = parsed.data;
  const supabase = await createClient();

  // Check username availability before creating auth user
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle();

  if (existingProfile) {
    return { fieldErrors: { username: ['This username is already taken.'] } };
  }

  // Create auth user — Supabase sends confirmation email automatically
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://luvr-nine.vercel.app';
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/app/dashboard`,
      data: { username, display_name: displayName },
    },
  });

  if (authError) {
    if (authError.message.toLowerCase().includes('already registered')) {
      return { error: 'An account with this email already exists. Try logging in.' };
    }
    return { error: authError.message };
  }

  // If email confirmation is required, redirect to verify page
  if (authData.user && !authData.session) {
    redirect('/verify-email');
  }

  // If email confirmation is disabled in Supabase (auto-confirm), create profile and redirect
  if (authData.user && authData.session) {
    await supabase.from('profiles').insert({
      id: authData.user.id,
      username,
      display_name: displayName,
      theme_id: 'pink-pookie',
    });
    revalidatePath('/app/dashboard');
    redirect('/app/dashboard');
  }

  return { success: true };
}

// ─── Log In ───────────────────────────────────────────────────────────────

export async function logIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Invalid email or password.' };
  }

  revalidatePath('/app/dashboard');
  redirect('/app/dashboard');
}

// ─── Log Out ──────────────────────────────────────────────────────────────

export async function logOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

// ─── Reset Password ───────────────────────────────────────────────────────

export async function resetPassword(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formData.get('email');
  if (!email || typeof email !== 'string') {
    return { fieldErrors: { email: ['Email is required.'] } };
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://luvr-nine.vercel.app';
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/app/settings`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// ─── Update Profile ───────────────────────────────────────────────────────

export async function updateProfile(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated.' };

  const displayName = formData.get('displayName') as string | null;
  const bio = formData.get('bio') as string | null;
  const themeId = formData.get('themeId') as string | null;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (displayName) updates.display_name = displayName.slice(0, 50);
  if (bio !== null) updates.bio = bio.slice(0, 200);
  if (themeId) updates.theme_id = themeId;

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/app/profile');
  revalidatePath('/app/dashboard');
  return { success: true };
}
