'use client';

import { useTransition } from 'react';
import { logOut } from '../../app/actions/auth';

export function LogOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logOut())}
      disabled={pending}
      className="w-full py-2.5 rounded-2xl border border-red-200 text-red-600 font-semibold
                 text-sm hover:bg-red-50 disabled:opacity-60 transition-colors"
    >
      {pending ? 'Logging out…' : 'Log out'}
    </button>
  );
}
