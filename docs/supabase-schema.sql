-- ============================================================
-- Luvr — Supabase Schema
-- Developed by BITRA MANIKANTA
--
-- HOW TO RUN:
-- 1. Go to supabase.com → your project → SQL Editor
-- 2. Click "New query"
-- 3. Paste THIS ENTIRE FILE and click "Run"
-- ============================================================


-- ── 1. profiles table ────────────────────────────────────────

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

create index if not exists idx_profiles_username on public.profiles(username);


-- ── 2. Row-level security for profiles ───────────────────────

alter table public.profiles enable row level security;

create policy "profiles_select"
  on public.profiles for select
  using (auth.uid() = id or is_private = false);

create policy "profiles_insert"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);


-- ── 3. Auto-create profile trigger ───────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
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
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── 4. waitlist table ─────────────────────────────────────────

create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

create policy "waitlist_insert_anon"
  on public.waitlist for insert
  with check (true);
