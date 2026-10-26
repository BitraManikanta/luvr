import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// The metadataBase is updated to the real Vercel deployment URL.
// Change this to your custom domain once purchased (e.g. https://luvr.com).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://luvr-nine.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'Luvr – Where Love Lives',
    template: '%s | Luvr',
  },
  description:
    'Luvr is the privacy-first messaging and social app for couples. Encrypted chats, couple games, stories, shared memories, and more — all in one beautiful place.',
  keywords: ['Luvr', 'messaging app', 'couples app', 'private chat', 'end-to-end encryption', 'love', 'social', 'romantic app'],
  authors: [{ name: 'BITRA MANIKANTA' }],
  creator: 'BITRA MANIKANTA',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Luvr',
    title: 'Luvr – Where Love Lives',
    description: 'The privacy-first messaging and social app for couples. Developed by BITRA MANIKANTA.',
    images: [
      {
        url: '/og/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Luvr – Where Love Lives',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luvr – Where Love Lives',
    description: 'The privacy-first messaging and social app for couples.',
    images: ['/og/og-image.png'],
    creator: '@luvr_app',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FF85A1' },
    { media: '(prefers-color-scheme: dark)', color: '#1A0A2E' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
