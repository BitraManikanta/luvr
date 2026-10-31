import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import type { Profile } from '../../../lib/supabase/types';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false },
};

const THEMES = [
  { id: 'pink-pookie', name: 'Pink Pookie', gradient: 'from-pink-300 to-rose-400' },
  { id: 'lavender-dream', name: 'Lavender Dream', gradient: 'from-violet-300 to-purple-500' },
  { id: 'midnight-love', name: 'Midnight Love', gradient: 'from-indigo-900 to-purple-900' },
  { id: 'cherry-blossom', name: 'Cherry Blossom', gradient: 'from-rose-300 to-pink-400' },
];

const FEATURES_COMING = [
  { icon: '💬', label: 'Private Messaging', desc: 'Encrypted one-to-one and group chats' },
  { icon: '🎮', label: 'Couple Games', desc: 'Truth or Dare, Would You Rather & more' },
  { icon: '💕', label: 'Couple Space', desc: 'Anniversaries, memories, love letters' },
  { icon: '🌸', label: 'Stories & Feed', desc: 'Share moments with followers' },
  { icon: '📞', label: 'Voice & Video', desc: 'Crystal-clear calls with your partner' },
  { icon: '🤖', label: 'AI Companion', desc: 'Private writing assistant' },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const profile = data as Profile | null;

  const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'there';
  const username = profile?.username ?? '';

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-luvora-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-luvora-300 to-luvora-500
                          flex items-center justify-center text-2xl shadow-md shadow-luvora-100 flex-shrink-0">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <span>💌</span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">
              Hey, {displayName}! 👋
            </h1>
            {username && (
              <p className="text-sm text-gray-500">@{username}</p>
            )}
          </div>
        </div>

        <div className="mt-4 p-4 bg-luvora-50 rounded-2xl border border-luvora-100">
          <p className="text-sm font-semibold text-luvora-600 mb-1">🚀 You&apos;re in early access!</p>
          <p className="text-xs text-gray-500">
            Luvr is being built right now. Features are rolling out one by one.
            You&apos;ll get notified as each one goes live.
          </p>
        </div>
      </div>

      {/* Theme picker */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-luvora-100">
        <h2 className="text-lg font-bold text-gray-900 mb-1">🎨 Your Theme</h2>
        <p className="text-xs text-gray-500 mb-4">
          Pick your style — more themes available in Settings.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {THEMES.map((t) => (
            <Link
              key={t.id}
              href={`/app/settings?theme=${t.id}`}
              className={`relative rounded-2xl aspect-square bg-gradient-to-br ${t.gradient}
                         flex items-end p-2 shadow-sm hover:shadow-md hover:-translate-y-0.5
                         transition-all cursor-pointer border-2 ${
                           profile?.theme_id === t.id
                             ? 'border-white shadow-luvora-200 ring-2 ring-luvora-300'
                             : 'border-transparent'
                         }`}
            >
              <span className="text-white text-xs font-bold drop-shadow leading-tight">{t.name}</span>
              {profile?.theme_id === t.id && (
                <span className="absolute top-2 right-2 text-white text-xs bg-white/30 rounded-full px-1.5 py-0.5">
                  ✓
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Coming soon features */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-luvora-100">
        <h2 className="text-lg font-bold text-gray-900 mb-1">✨ Coming for you</h2>
        <p className="text-xs text-gray-500 mb-4">
          These features are under active development.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES_COMING.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100"
            >
              <span className="text-2xl flex-shrink-0">{f.icon}</span>
              <div>
                <p className="font-semibold text-sm text-gray-900">{f.label}</p>
                <p className="text-xs text-gray-400">{f.desc}</p>
              </div>
              <span className="ml-auto text-xs text-gray-300 bg-gray-100 rounded-full px-2 py-0.5 flex-shrink-0">
                Soon
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/app/profile"
          className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-luvora-100
                     shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <span className="text-2xl">👤</span>
          <div>
            <p className="font-semibold text-sm text-gray-900">My Profile</p>
            <p className="text-xs text-gray-400">Edit your info</p>
          </div>
        </Link>
        <Link
          href="/app/settings"
          className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-luvora-100
                     shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <span className="text-2xl">⚙️</span>
          <div>
            <p className="font-semibold text-sm text-gray-900">Settings</p>
            <p className="text-xs text-gray-400">Themes, privacy, account</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
