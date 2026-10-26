import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Luvr support — get help with your account, messages, and privacy settings.',
};

const faqs = [
  {
    q: 'How do I join the waitlist?',
    a: 'Scroll to the bottom of the home page and enter your email. You\'ll receive early-access details when Luvr launches.',
  },
  {
    q: 'Is my data safe?',
    a: 'Luvr is built privacy-first. Private messages are end-to-end encrypted once the encryption phase is active. The server never stores your message content in a form we can read.',
  },
  {
    q: 'When does the app launch?',
    a: 'We are actively building. Join the waitlist and you\'ll be among the first to know.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Account deletion is available inside Settings › Account › Delete Account once the app is live. Contact us at hello@luvr.app if you need help.',
  },
  {
    q: 'How do I report a security issue?',
    a: 'Please email security@luvr.app. Do not disclose security vulnerabilities publicly. We respond within 48 hours.',
  },
  {
    q: 'Where can I read the privacy policy?',
    a: 'Read the full Privacy Policy at luvr.app/privacy.',
  },
];

export default function SupportPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-24">
      <Link href="/" className="text-luvora-500 hover:text-luvora-600 text-sm mb-8 block">
        ← Back to home
      </Link>

      <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Support</h1>
      <p className="text-gray-500 mb-12">
        Need help? Find answers below or contact us directly.
      </p>

      <div className="space-y-6">
        {faqs.map(({ q, a }) => (
          <div key={q} className="bg-luvora-50 rounded-2xl p-6 border border-luvora-100">
            <h2 className="font-bold text-gray-900 mb-2">{q}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500 mb-4">Still need help?</p>
        <a
          href="mailto:hello@luvr.app"
          className="inline-block px-6 py-3 rounded-2xl bg-luvora-300 text-white font-bold hover:bg-luvora-400 transition-colors"
        >
          Email hello@luvr.app
        </a>
      </div>
    </main>
  );
}
