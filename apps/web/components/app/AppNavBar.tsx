'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  displayName: string;
  username: string;
  avatarUrl: string | null;
}

const NAV = [
  { href: '/app/dashboard', label: '🏠 Home' },
  { href: '/app/profile', label: '👤 Profile' },
  { href: '/app/settings', label: '⚙️ Settings' },
];

export function AppNavBar({ displayName, username }: Props) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-luvora-100 shadow-sm shadow-luvora-50">
      <nav
        className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4"
        aria-label="App navigation"
      >
        {/* Logo */}
        <Link href="/app/dashboard" className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xl" aria-label="Luvr">💌</span>
          <span className="font-extrabold text-luvora-500 text-lg">Luvr</span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname === href
                  ? 'bg-luvora-100 text-luvora-600'
                  : 'text-gray-500 hover:text-luvora-500 hover:bg-luvora-50'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* User badge */}
        <Link
          href="/app/profile"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                     bg-luvora-50 hover:bg-luvora-100 transition-colors flex-shrink-0"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-luvora-300 to-luvora-500
                          flex items-center justify-center text-xs">
            💌
          </div>
          <span className="text-sm font-semibold text-luvora-600 max-w-24 truncate">
            {username ? `@${username}` : displayName}
          </span>
        </Link>
      </nav>

      {/* Mobile bottom bar */}
      <div className="sm:hidden flex border-t border-luvora-100">
        {NAV.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 py-2 text-center text-xs font-semibold transition-colors ${
              pathname === href
                ? 'text-luvora-500 bg-luvora-50'
                : 'text-gray-400 hover:text-luvora-400'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </header>
  );
}
