'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav
        className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Luvr home">
          <span className="text-2xl" role="img" aria-label="Heart letter">💌</span>
          <span className="font-bold text-xl text-luvora-600">Luvr</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#privacy">Privacy</NavLink>
          <NavLink href="#themes">Themes</NavLink>
          <NavLink href="#waitlist">Get Early Access</NavLink>
        </div>

        {/* CTA */}
        <Link
          href="#waitlist"
          className="px-4 py-2 rounded-full bg-luvora-300 text-white font-semibold text-sm hover:bg-luvora-400 transition-colors"
        >
          Join Waitlist
        </Link>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-gray-600 hover:text-luvora-500 transition-colors"
    >
      {children}
    </a>
  );
}
