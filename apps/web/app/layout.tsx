import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Luvora – Where Love Lives',
    template: '%s | Luvora',
  },
  description:
    'Luvora is the privacy-first messaging and social app for couples and the people they love. End-to-end encrypted chats, couple games, stories, and more.',
  keywords: ['messaging app', 'couples app', 'private chat', 'end-to-end encryption', 'love', 'social'],
  authors: [{ name: 'Luvora' }],
  creator: 'Luvora',
  metadataBase: new URL('https://luvora.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luvora.app',
    siteName: 'Luvora',
    title: 'Luvora – Where Love Lives',
    description: 'The privacy-first messaging and social app for couples.',
    images: [
      {
        url: '/og/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Luvora – Where Love Lives',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luvora – Where Love Lives',
    description: 'The privacy-first messaging and social app for couples.',
    images: ['/og/og-image.png'],
    creator: '@luvoraapp',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FF85A1' },
    { media: '(prefers-color-scheme: dark)', color: '#1A0A2E' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
