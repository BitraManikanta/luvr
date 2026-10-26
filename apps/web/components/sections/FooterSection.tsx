import Link from 'next/link';

export function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="heart letter">💌</span>
              <span className="font-bold text-xl text-luvora-600">Luvr</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Where love lives, grows, and shines. A privacy-first messaging and social app.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <FooterLinkGroup
              title="Product"
              links={[
                { label: 'Features', href: '#features' },
                { label: 'Themes', href: '#themes' },
                { label: 'Privacy', href: '#privacy' },
                { label: 'About', href: '/about' },
              ]}
            />
            <FooterLinkGroup
              title="Legal"
              links={[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Security', href: '/security' },
              ]}
            />
            <FooterLinkGroup
              title="Contact"
              links={[
                { label: 'hello@luvr.app', href: 'mailto:hello@luvr.app' },
                { label: 'Support', href: '/support' },
                { label: 'About', href: '/about' },
              ]}
            />
          </div>
        </div>

        {/* Bottom bar with attribution */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-400">
          <p>© {year} Luvr. All rights reserved.</p>
          <p className="font-medium text-gray-500">
            Developed by{' '}
            <Link href="/about" className="text-luvora-500 hover:text-luvora-600 font-semibold">
              BITRA MANIKANTA
            </Link>
          </p>
          <p>Made with 💕 for lovers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-3 text-sm">{title}</h4>
      <ul className="space-y-2">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-gray-400 hover:text-luvora-500 text-sm transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
