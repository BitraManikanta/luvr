import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Luvora Terms of Service.',
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-24">
      <Link href="/" className="text-luvora-500 hover:text-luvora-600 text-sm mb-8 block">
        ← Back to home
      </Link>
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: October 26, 2026</p>
      <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance</h2>
          <p>
            By creating an account or using Luvora, you agree to these Terms of Service.
            If you do not agree, you may not use the service.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Eligibility</h2>
          <p>
            You must be at least 13 years old to use Luvora. If you are under 18, you
            represent that your parent or guardian has reviewed and agreed to these terms.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Use Luvora to harass, threaten, or harm others.</li>
            <li>Share illegal content or content that violates third-party rights.</li>
            <li>Attempt to reverse-engineer, interfere with, or circumvent our systems.</li>
            <li>Create fake accounts or impersonate others.</li>
            <li>Use Luvora to distribute malware or spam.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Account security</h2>
          <p>
            You are responsible for maintaining the security of your account credentials.
            Notify us immediately at{' '}
            <a href="mailto:security@luvora.app" className="text-luvora-500">
              security@luvora.app
            </a>{' '}
            if you suspect unauthorized access.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Limitation of liability</h2>
          <p>
            Luvora is provided "as is." We are not liable for indirect, incidental, or
            consequential damages arising from your use of the service to the maximum extent
            permitted by applicable law.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Contact</h2>
          <p>
            Questions:{' '}
            <a href="mailto:hello@luvora.app" className="text-luvora-500">
              hello@luvora.app
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
