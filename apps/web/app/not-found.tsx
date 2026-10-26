import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-luvora-50 px-4 text-center">
      <p className="text-7xl mb-6" role="img" aria-label="heart letter">💌</p>
      <h1 className="text-5xl font-extrabold text-luvora-500 mb-3">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        Oops! This page got lost in the love letters.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-2xl bg-luvora-300 text-white font-bold hover:bg-luvora-400 transition-colors"
      >
        Take me home 🌸
      </Link>
    </main>
  );
}
