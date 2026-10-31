import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import { AppNavBar } from '../../components/app/AppNavBar';
import type { Profile } from '../../lib/supabase/types';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const profile = data as Profile | null;

  return (
    <div className="min-h-screen bg-luvora-50">
      <AppNavBar
        displayName={profile?.display_name ?? user.email ?? 'You'}
        username={profile?.username ?? ''}
        avatarUrl={profile?.avatar_url ?? null}
      />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
