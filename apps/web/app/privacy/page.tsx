import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Luvora Privacy Policy – how we handle your data.',
};

export default function PrivacyPage() {
  const updated = 'October 26, 2026';

  return (
    <main className="max-w-3xl mx-auto px-4 py-24">
      <Link href="/" className="text-luvora-500 hover:text-luvora-600 text-sm mb-8 block">
        ← Back to home
      </Link>

      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: {updated}</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Who we are</h2>
          <p>
            Luvr ("we", "us", "our") is a privacy-first messaging and social application.
            Developed by BITRA MANIKANTA.
            This policy describes how we collect, use, and protect your information when you
            use our mobile application and website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. What we collect</h2>
          <p>We collect the minimum information necessary to provide the service:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Account information: username, email address, and a hashed password.</li>
            <li>Public profile data: display name, profile photo, and bio that you choose to share.</li>
            <li>Device identifiers and public encryption keys required to deliver messages.</li>
            <li>Delivery metadata: who sent a message to whom, when, and whether it was delivered. Not message content.</li>
            <li>Push notification tokens to deliver alerts when you receive a message.</li>
            <li>Usage analytics that do not include message content (crash reports, performance metrics).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. What we never collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>The plaintext content of your private messages (once E2E encryption is active in Phase 4).</li>
            <li>Your private encryption keys — these are generated on your device and never leave it.</li>
            <li>Decrypted media from private conversations.</li>
            <li>Location data unless you explicitly choose to share your location with a partner.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. How we use your data</h2>
          <p>We use your data solely to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Operate and improve the Luvora service.</li>
            <li>Deliver messages and notifications.</li>
            <li>Prevent abuse, fraud, and violations of our Terms of Service.</li>
            <li>Respond to legal obligations when required.</li>
          </ul>
          <p className="mt-3">
            We do not sell your data. We do not use your private messages to target
            advertisements. We do not profile you for third-party marketing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. AI features</h2>
          <p>
            On-device AI features process data locally and no content is sent to our
            servers or third parties. Optional cloud AI features — such as romantic letter
            generation — require your explicit consent before any content is transmitted.
            You will always see what will be shared before confirming.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data retention</h2>
          <p>
            Encrypted message envelopes are retained until you delete them or your expiry
            timer fires. Delivery metadata is purged after 30 days. Account data is deleted
            within 30 days of an account deletion request.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your rights</h2>
          <p>You may at any time:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Export your data from Settings › Privacy › Export Data.</li>
            <li>Delete your account from Settings › Account › Delete Account.</li>
            <li>Revoke AI data-sharing consent from Settings › AI › Data Preferences.</li>
            <li>Contact us at <a href="mailto:privacy@luvora.app" className="text-luvora-500">privacy@luvora.app</a>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact</h2>
          <p>
            Privacy questions:{' '}
            <a href="mailto:privacy@luvora.app" className="text-luvora-500">
              privacy@luvora.app
            </a>
            <br />
            Security disclosures:{' '}
            <a href="mailto:security@luvora.app" className="text-luvora-500">
              security@luvora.app
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
