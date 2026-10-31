import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import { ProfileForm } from '../../../components/app/ProfileForm';
import type { Profile } from '../../../lib/supabase/types';

export const metadata: Metadata = {
  title: 'My Profile',
  robots: { index: false },
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const profile = data as Profile | null;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          This is how others will see you on Luvr.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-luvora-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-luvora-300 to-luvora-500
                          flex items-center justify-center text-3xl shadow-md">
            💌
          </div>
          <div>
            <p className="font-bold text-gray-900">
              {profile?.display_name ?? user.email}
            </p>
            {profile?.username && (
              <p className="text-sm text-gray-500">@{profile.username}</p>
            )}
            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        <ProfileForm
          displayName={profile?.display_name ?? ''}
          bio={profile?.bio ?? ''}
          themeId={profile?.theme_id ?? 'pink-pookie'}
        />
      </div>
    </div>
  );
}
