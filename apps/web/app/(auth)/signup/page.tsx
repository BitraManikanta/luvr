import type { Metadata } from 'next';
import Link from 'next/link';
import { SignUpForm } from '../../../components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Sign up for Luvr – the privacy-first messaging app for couples.',
  robots: { index: false },
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-luvora-50 to-white flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="text-3xl" role="img" aria-label="Luvr">💌</span>
        <span className="text-2xl font-extrabold text-luvora-500">Luvr</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-luvora-100 border border-luvora-100 p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account</h1>
        <p className="text-gray-500 text-sm mb-6">
          Free forever. No credit card needed. 💕
        </p>

        <SignUpForm />

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-luvora-500 font-semibold hover:text-luvora-600">
            Log in
          </Link>
        </p>
      </div>

      <p className="mt-6 text-xs text-gray-400 text-center max-w-sm">
        By creating an account you agree to our{' '}
        <Link href="/terms" className="underline hover:text-luvora-500">Terms</Link>
        {' '}and{' '}
        <Link href="/privacy" className="underline hover:text-luvora-500">Privacy Policy</Link>.
      </p>
    </div>
  );
}
