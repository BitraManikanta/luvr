import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import { LogOutButton } from '../../../components/app/LogOutButton';

export const metadata: Metadata = {
  title: 'Settings',
  robots: { index: false },
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>

      {/* Account info */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-luvora-100 space-y-3">
        <h2 className="font-bold text-gray-900">Account</h2>
        <Row label="Email" value={user.email ?? '—'} />
        <Row label="Username" value={profile?.username ? `@${profile.username}` : '—'} />
        <Row label="Display name" value={profile?.display_name ?? '—'} />
        <Link
          href="/app/profile"
          className="inline-block mt-2 text-sm text-luvora-500 font-semibold hover:text-luvora-600"
        >
          Edit profile →
        </Link>
      </section>

      {/* Privacy */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-luvora-100">
        <h2 className="font-bold text-gray-900 mb-3">Privacy</h2>
        <p className="text-sm text-gray-500">
          Full privacy controls — who can contact you, see your status, read receipts,
          story visibility — are coming in the next release.
        </p>
        <Link href="/privacy" className="text-sm text-luvora-500 hover:text-luvora-600 mt-2 inline-block">
          Read our Privacy Policy →
        </Link>
      </section>

      {/* Danger zone */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-red-100">
        <h2 className="font-bold text-red-600 mb-3">Account actions</h2>
        <LogOutButton />
      </section>

      {/* Attribution */}
      <p className="text-center text-xs text-gray-400 pb-8">
        Luvr — Developed by{' '}
        <Link href="/about" className="text-luvora-500 hover:text-luvora-600">
          BITRA MANIKANTA
        </Link>
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
