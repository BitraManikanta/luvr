import type { Metadata } from 'next';
import Link from 'next/link';
import { ResetPasswordForm } from '../../../components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password',
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-luvora-50 to-white flex flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="text-3xl" role="img" aria-label="Luvr">💌</span>
        <span className="text-2xl font-extrabold text-luvora-500">Luvr</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-luvora-100 border border-luvora-100 p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Reset your password</h1>
        <p className="text-gray-500 text-sm mb-6">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <ResetPasswordForm />

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/login" className="text-luvora-500 hover:text-luvora-600">
            ← Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
