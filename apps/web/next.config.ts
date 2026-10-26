import type { NextConfig } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://luvr-nine.vercel.app';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Required for monorepo: transpile shared packages
  transpilePackages: ['@luvora/shared-types'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'luvr-nine.vercel.app' },
      { protocol: 'https', hostname: 'luvr.app' },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      // Don't index private app routes (for when auth pages are added)
      {
        source: '/api/(.*)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ];
  },

  async redirects() {
    return [
      // www → non-www (useful once a custom domain is added)
      // Disabled until custom domain is purchased
    ];
  },
};

export default nextConfig;
