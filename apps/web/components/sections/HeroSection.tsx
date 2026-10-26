'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const floatingEmojis = [
  { emoji: '💕', x: '8%', y: '20%', delay: 0 },
  { emoji: '🌸', x: '85%', y: '15%', delay: 0.5 },
  { emoji: '💝', x: '15%', y: '70%', delay: 1.0 },
  { emoji: '✨', x: '80%', y: '65%', delay: 0.3 },
  { emoji: '🥰', x: '50%', y: '10%', delay: 0.8 },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-luvora-50 to-white pt-16">
      {/* Floating decorative emojis */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {floatingEmojis.map(({ emoji, x, y, delay }) => (
          <motion.div
            key={emoji}
            className="absolute text-3xl select-none opacity-40"
            style={{ left: x, top: y }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            {emoji}
          </motion.div>
        ))}

        {/* Gradient blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-luvora-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lavender-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luvora-100 text-luvora-600 text-sm font-semibold mb-6"
        >
          <span>🔒</span>
          <span>End-to-end encrypted &middot; Coming soon</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
        >
          <span className="text-gradient">Where love</span>
          <br />
          <span className="text-gray-900">lives, grows,</span>
          <br />
          <span className="text-gradient">and shines.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10"
        >
          Luvora is a privacy-first messaging and social app for couples and the people they love.
          Encrypted chats, couple games, stories, AI companion, and more — all in one beautiful place.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#waitlist"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-luvora-300 text-white font-bold text-lg hover:bg-luvora-400 transition-all shadow-lg shadow-luvora-200 hover:shadow-luvora-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            Join the Waitlist 🌸
          </Link>
          <Link
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-luvora-200 text-luvora-600 font-bold text-lg hover:bg-luvora-50 transition-all"
          >
            Learn More
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 text-sm text-gray-400"
        >
          Built for privacy. Designed with love. 💌
        </motion.p>
      </div>
    </section>
  );
}
