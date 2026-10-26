import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Luvr – the privacy-first messaging and social app for couples. Developed by BITRA MANIKANTA.',
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-24">
      <Link href="/" className="text-luvora-500 hover:text-luvora-600 text-sm mb-8 block">
        ← Back to home
      </Link>

      <div className="text-center mb-12">
        <span className="text-6xl block mb-4" role="img" aria-label="heart letter">💌</span>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">About Luvr</h1>
        <p className="text-lg text-gray-500">
          Where love lives, grows, and shines.
        </p>
      </div>

      <div className="space-y-10 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">What is Luvr?</h2>
          <p>
            Luvr is a privacy-first messaging and social application designed for couples and the
            people they love. We combine the best of private encrypted messaging, social
            networking, couple activities, AI assistance, and short-form video — all in one
            cohesive, beautiful product.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
          <p>
            We believe that intimate conversations deserve the strongest possible privacy
            protection. Luvr is built on the principle that nobody — not even us — should be
            able to read your private messages. At the same time, we believe that privacy and
            beauty are not opposites. Luvr is designed to feel warm, joyful, and delightful.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              '🔒 End-to-end encrypted messaging',
              '💬 Rich chat: emoji, stickers, voice, GIFs',
              '🎮 15+ couple games inside chat',
              '💕 Anniversary countdowns & memories',
              '🌸 Stories, social feed & reels',
              '🎨 12 free beautiful themes',
              '📞 Audio & video calls',
              '🤖 Private AI companion',
              '📴 Works offline with auto-retry',
              '🔑 Secure device key management',
              '🌙 Elegant dark mode',
              '♿ Accessibility-first design',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm bg-luvora-50 rounded-xl px-4 py-3">
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Privacy First</h2>
          <p>
            Luvr uses an established end-to-end encryption protocol. Your private messages are
            encrypted on your device before they ever reach our servers. We physically cannot
            read your conversations. Read our full{' '}
            <Link href="/privacy" className="text-luvora-500 hover:text-luvora-600">
              Privacy Policy
            </Link>{' '}
            for details.
          </p>
        </section>

        {/* Developer credit — required and prominent */}
        <section className="bg-gradient-to-r from-luvora-50 to-lavender-100 rounded-2xl p-8 text-center border border-luvora-100">
          <span className="text-4xl block mb-3" role="img" aria-label="developer">👨‍💻</span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Developer</h2>
          <p className="text-2xl font-extrabold text-luvora-600 mb-3">BITRA MANIKANTA</p>
          <p className="text-gray-500 text-sm">
            Luvr was designed and developed by BITRA MANIKANTA — a passionate developer
            building privacy-first products for people who love each other.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <a
              href="https://github.com/BitraManikanta"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-luvora-500 hover:text-luvora-600 font-semibold underline"
            >
              GitHub @BitraManikanta
            </a>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Contact</h2>
          <p>
            Questions, feedback, or partnership inquiries:{' '}
            <a href="mailto:hello@luvr.app" className="text-luvora-500 hover:text-luvora-600">
              hello@luvr.app
            </a>
          </p>
          <p className="mt-2">
            Security disclosures:{' '}
            <a href="mailto:security@luvr.app" className="text-luvora-500 hover:text-luvora-600">
              security@luvr.app
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
