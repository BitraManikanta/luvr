import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import { AppNavBar } from '../../components/app/AppNavBar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

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
