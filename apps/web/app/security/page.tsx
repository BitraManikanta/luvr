import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security',
  description: 'Luvr security disclosure policy and contact information.',
};

export default function SecurityPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-24">
      <Link href="/" className="text-luvora-500 hover:text-luvora-600 text-sm mb-8 block">
        ← Back to home
      </Link>

      <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Security</h1>
      <p className="text-gray-500 mb-10">
        Security is at the core of Luvr. This page describes our security model and responsible disclosure process.
      </p>

      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Responsible Disclosure</h2>
          <p>
            If you discover a security vulnerability in Luvr, please report it responsibly. Do not
            disclose the issue publicly before it has been resolved.
          </p>
          <p className="mt-3">
            Contact us at{' '}
            <a href="mailto:security@luvr.app" className="text-luvora-500 font-semibold">
              security@luvr.app
            </a>{' '}
            with:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-1 text-sm">
            <li>A description of the vulnerability</li>
            <li>Steps to reproduce it</li>
            <li>Potential impact</li>
            <li>Any suggested mitigations</li>
          </ul>
          <p className="mt-3">We respond within 48 hours and aim to resolve critical issues within 7 days.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">What We Protect</h2>
          <ul className="space-y-2 text-sm">
            {[
              'Private messages are end-to-end encrypted (once fully deployed)',
              'Passwords are hashed using bcrypt with a high cost factor',
              'JWT tokens use short expiry with secure refresh rotation',
              'API endpoints are rate-limited to prevent abuse',
              'All traffic is encrypted with TLS',
              'Secrets are stored in environment variables, never in code',
              'Dependencies are monitored for known vulnerabilities',
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Known Limitations (Pre-launch)</h2>
          <p className="text-sm">
            End-to-end encryption is planned but not yet fully active in the current development
            build. The public website collects only email addresses for the waitlist, which are
            stored securely and never sold or shared. See our{' '}
            <Link href="/privacy" className="text-luvora-500 hover:text-luvora-600">
              Privacy Policy
            </Link>{' '}
            for details.
          </p>
        </section>

        <section className="bg-luvora-50 rounded-2xl p-6 border border-luvora-100">
          <p className="text-sm">
            <strong>Developer:</strong> BITRA MANIKANTA
            <br />
            <strong>Security contact:</strong>{' '}
            <a href="mailto:security@luvr.app" className="text-luvora-500">
              security@luvr.app
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
