-- ============================================================
-- Luvr — Supabase Schema
-- Run this in: supabase.com → your project → SQL Editor
-- Developed by BITRA MANIKANTA
-- ============================================================

-- ── profiles ─────────────────────────────────────────────────
-- One row per user. id = auth.users.id (set by trigger).
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text not null unique,
  display_name  text not null,
  avatar_url    text,
  bio           text,
  is_private    boolean not null default false,
  theme_id      text not null default 'pink-pookie',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Username index for fast lookup
create index if not exists idx_profiles_username on public.profiles(username);

-- Row-level security: users can only read/write their own profile.
-- Public profiles are visible to everyone.
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id or is_private = false);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── Trigger: auto-create profile on signup ───────────────────
-- Fires after a new row is inserted into auth.users.
-- Uses the display_name and username from raw_user_meta_data
-- (passed via options.data in supabase.auth.signUp()).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── waitlist ──────────────────────────────────────────────────
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- Anyone can submit their email; nobody can read others'.
alter table public.waitlist enable row level security;

create policy "waitlist_insert_anon"
  on public.waitlist for insert
  with check (true);

-- ============================================================
-- Done! Now configure your Supabase project:
--
-- 1. Authentication → Email: enable "Confirm email" (recommended)
--    OR disable "Confirm email" for instant login (easier for testing).
-- 2. Authentication → URL Configuration:
--    Site URL:           https://luvr-nine.vercel.app
--    Redirect URLs:      https://luvr-nine.vercel.app/auth/callback
-- 3. After running this SQL, get your keys from:
--    Settings → API → Project URL and anon/service_role keys
-- ============================================================
