import { HeroSection } from '../components/sections/HeroSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { PrivacySection } from '../components/sections/PrivacySection';
import { ThemesSection } from '../components/sections/ThemesSection';
import { WaitlistSection } from '../components/sections/WaitlistSection';
import { FooterSection } from '../components/sections/FooterSection';
import { NavBar } from '../components/ui/NavBar';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://luvr-nine.vercel.app';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Luvr',
  description:
    'Luvr is a privacy-first messaging and social app for couples. End-to-end encrypted chats, couple games, stories, and more.',
  url: SITE_URL,
  applicationCategory: 'SocialNetworkingApplication',
  operatingSystem: 'iOS, Android',
  author: {
    '@type': 'Person',
    name: 'BITRA MANIKANTA',
    url: 'https://github.com/BitraManikanta',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen">
        <NavBar />
        <HeroSection />
        <FeaturesSection />
        <PrivacySection />
        <ThemesSection />
        <WaitlistSection />
        <FooterSection />
      </main>
    </>
  );
}
