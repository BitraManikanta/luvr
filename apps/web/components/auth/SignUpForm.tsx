'use client';

import { useActionState } from 'react';
import { signUp, type AuthFormState } from '../../app/actions/auth';

const initial: AuthFormState = {};

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, initial);

  return (
    <form action={action} className="space-y-4" noValidate>
      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {state.error}
        </div>
      )}

      {/* Display Name */}
      <Field
        label="Your name"
        id="displayName"
        name="displayName"
        placeholder="e.g. Manikanta"
        autoComplete="name"
        error={state.fieldErrors?.displayName?.[0]}
      />

      {/* Username */}
      <Field
        label="Username"
        id="username"
        name="username"
        placeholder="e.g. luvrmanikanta"
        autoComplete="username"
        error={state.fieldErrors?.username?.[0]}
        hint="Letters, numbers, and underscores only"
      />

      {/* Email */}
      <Field
        label="Email"
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={state.fieldErrors?.email?.[0]}
      />

      {/* Password */}
      <Field
        label="Password"
        id="password"
        name="password"
        type="password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        error={state.fieldErrors?.password?.[0]}
      />

      <div className="pt-1">
        <p className="text-xs text-gray-400 flex items-start gap-1 mb-4">
          <span>🔒</span>
          <span>
            Your messages will be end-to-end encrypted. We cannot read them.
          </span>
        </p>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 rounded-2xl bg-luvora-300 text-white font-bold text-base
                     hover:bg-luvora-400 disabled:opacity-60 disabled:cursor-not-allowed
                     transition-all shadow-md shadow-luvora-100"
        >
          {pending ? 'Creating account…' : 'Create Account 🌸'}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  error,
  hint,
}: {
  label: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 bg-luvora-50
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luvora-300
                    transition-all ${error ? 'border-red-400' : 'border-luvora-200'}`}
      />
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
