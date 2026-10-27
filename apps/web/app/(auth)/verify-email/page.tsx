import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Verify your email',
  robots: { index: false },
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-luvora-50 to-white flex flex-col items-center justify-center px-4 py-16 text-center">
      <span className="text-6xl mb-6" role="img" aria-label="mail">📬</span>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Check your email</h1>
      <p className="text-gray-500 max-w-sm mb-6">
        We sent a confirmation link to your email address. Click it to activate your account,
        then come back to log in.
      </p>
      <p className="text-sm text-gray-400">
        Didn&apos;t get it? Check your spam folder, or{' '}
        <Link href="/signup" className="text-luvora-500 hover:text-luvora-600 underline">
          try signing up again
        </Link>
        .
      </p>
      <Link
        href="/login"
        className="mt-8 px-6 py-3 rounded-2xl bg-luvora-300 text-white font-bold hover:bg-luvora-400 transition-colors"
      >
        Go to login
      </Link>
    </div>
  );
}
