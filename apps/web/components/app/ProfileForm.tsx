'use client';

import { useActionState } from 'react';
import { updateProfile, type AuthFormState } from '../../app/actions/auth';

const initial: AuthFormState = {};

const THEMES = [
  { id: 'pink-pookie', name: 'Pink Pookie 🌸' },
  { id: 'lavender-dream', name: 'Lavender Dream 💜' },
  { id: 'midnight-love', name: 'Midnight Love 🌙' },
  { id: 'cherry-blossom', name: 'Cherry Blossom 🌺' },
  { id: 'strawberry-milk', name: 'Strawberry Milk 🍓' },
  { id: 'peach-romance', name: 'Peach Romance 🍑' },
  { id: 'cloud-nine', name: 'Cloud Nine ☁️' },
  { id: 'teddy-bear', name: 'Teddy Bear 🧸' },
  { id: 'moonlight', name: 'Moonlight 🌕' },
  { id: 'rose-garden', name: 'Rose Garden 🌹' },
  { id: 'starlight', name: 'Starlight ⭐' },
  { id: 'minimal-cream', name: 'Minimal Cream 🍦' },
];

interface Props {
  displayName: string;
  bio: string;
  themeId: string;
}

export function ProfileForm({ displayName, bio, themeId }: Props) {
  const [state, action, pending] = useActionState(updateProfile, initial);

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          ✓ Profile updated!
        </div>
      )}

      {/* Display Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Display Name
        </label>
        <input
          name="displayName"
          defaultValue={displayName}
          maxLength={50}
          placeholder="Your name"
          className="w-full px-4 py-2.5 rounded-xl border border-luvora-200 text-sm
                     text-gray-900 bg-luvora-50 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-luvora-300 transition-all"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Bio <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          name="bio"
          defaultValue={bio}
          maxLength={200}
          rows={3}
          placeholder="Tell people a bit about yourself…"
          className="w-full px-4 py-2.5 rounded-xl border border-luvora-200 text-sm
                     text-gray-900 bg-luvora-50 placeholder-gray-400 resize-none
                     focus:outline-none focus:ring-2 focus:ring-luvora-300 transition-all"
        />
      </div>

      {/* Theme */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Theme
        </label>
        <select
          name="themeId"
          defaultValue={themeId}
          className="w-full px-4 py-2.5 rounded-xl border border-luvora-200 text-sm
                     text-gray-900 bg-luvora-50
                     focus:outline-none focus:ring-2 focus:ring-luvora-300 transition-all"
        >
          {THEMES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 rounded-2xl bg-luvora-300 text-white font-bold
                   hover:bg-luvora-400 disabled:opacity-60 transition-all shadow-md shadow-luvora-100"
      >
        {pending ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
}
