'use client';

import { useActionState } from 'react';
import { logIn, type AuthFormState } from '../../app/actions/auth';

const initial: AuthFormState = {};

interface Props {
  nextPath?: string;
}

export function LogInForm({ nextPath }: Props) {
  const [state, action, pending] = useActionState(logIn, initial);

  return (
    <form action={action} className="space-y-4" noValidate>
      {/* Pass the next path so the server action can redirect correctly */}
      {nextPath && <input type="hidden" name="next" value={nextPath} />}

      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 bg-luvora-50
                      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luvora-300
                      transition-all ${state.fieldErrors?.email ? 'border-red-400' : 'border-luvora-200'}`}
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-xs text-red-500">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          required
          className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 bg-luvora-50
                      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luvora-300
                      transition-all ${state.fieldErrors?.password ? 'border-red-400' : 'border-luvora-200'}`}
        />
        {state.fieldErrors?.password && (
          <p className="mt-1 text-xs text-red-500">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 rounded-2xl bg-luvora-300 text-white font-bold text-base
                   hover:bg-luvora-400 disabled:opacity-60 disabled:cursor-not-allowed
                   transition-all shadow-md shadow-luvora-100 mt-2"
      >
        {pending ? 'Logging in…' : 'Log In 💝'}
      </button>
    </form>
  );
}
