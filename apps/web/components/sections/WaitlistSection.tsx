'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? 'Signup failed.');
      }

      setStatus('success');
      setMessage("You're on the list! We'll send you early access details. 💌");
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="waitlist" className="py-24 px-4 bg-gradient-to-b from-luvora-50 to-luvora-100">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-5xl mb-4 block" role="img" aria-label="envelope">
            💌
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
            Be the first to{' '}
            <span className="text-gradient">experience Luvr</span>
          </h2>
          <p className="text-lg text-gray-500 mb-10">
            Sign up for early access. No spam, no sharing your email — just Luvora updates.
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl bg-white border border-luvora-200 shadow-sm"
            >
              <p className="text-luvora-600 font-semibold text-lg">{message}</p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
              aria-label="Waitlist signup form"
            >
              <label htmlFor="waitlist-email" className="sr-only">
                Email address
              </label>
              <input
                id="waitlist-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-5 py-4 rounded-2xl border-2 border-luvora-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-luvora-400 transition-colors text-base"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-4 rounded-2xl bg-luvora-300 text-white font-bold text-base hover:bg-luvora-400 disabled:opacity-70 transition-all shadow-lg shadow-luvora-200"
              >
                {status === 'loading' ? 'Joining…' : 'Join Waitlist 🌸'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-3 text-red-500 text-sm">{message}</p>
          )}

          <p className="mt-6 text-xs text-gray-400">
            By joining you agree to our{' '}
            <a href="/privacy" className="underline hover:text-luvora-500">
              Privacy Policy
            </a>
            . We will never sell your email.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
