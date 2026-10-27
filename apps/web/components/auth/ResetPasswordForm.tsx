'use client';

import { useActionState } from 'react';
import { resetPassword, type AuthFormState } from '../../app/actions/auth';

const initial: AuthFormState = {};

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(resetPassword, initial);

  if (state.success) {
    return (
      <div className="text-center py-4">
        <span className="text-4xl block mb-3">📬</span>
        <p className="text-gray-700 font-semibold mb-1">Reset link sent!</p>
        <p className="text-gray-500 text-sm">Check your email inbox (and spam folder).</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4" noValidate>
      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-luvora-200 text-sm
                     text-gray-900 bg-luvora-50 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-luvora-300 transition-all"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-xs text-red-500">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 rounded-2xl bg-luvora-300 text-white font-bold text-base
                   hover:bg-luvora-400 disabled:opacity-60 transition-all shadow-md shadow-luvora-100"
      >
        {pending ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  );
}
