import type { Metadata } from 'next';
import Link from 'next/link';
import { LogInForm } from '../../../components/auth/LogInForm';

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Log in to your Luvr account.',
  robots: { index: false },
};

// Next.js 15: searchParams values are string | string[] | undefined
interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0];
  return val;
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const nextPath = getString(params['next']);
  const error = getString(params['error']);

  return (
    <div className="min-h-screen bg-gradient-to-b from-luvora-50 to-white flex flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="text-3xl" role="img" aria-label="Luvr">💌</span>
        <span className="text-2xl font-extrabold text-luvora-500">Luvr</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-luvora-100 border border-luvora-100 p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back 💝</h1>
        <p className="text-gray-500 text-sm mb-6">Log in to continue your story.</p>

        {error === 'auth' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            Invalid email or password. Please try again.
          </div>
        )}

        <LogInForm nextPath={nextPath} />

        <div className="mt-4 text-right">
          <Link href="/reset-password" className="text-sm text-luvora-500 hover:text-luvora-600">
            Forgot password?
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-luvora-500 font-semibold hover:text-luvora-600">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
