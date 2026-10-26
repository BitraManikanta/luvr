import { HeroSection } from '../components/sections/HeroSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { PrivacySection } from '../components/sections/PrivacySection';
import { ThemesSection } from '../components/sections/ThemesSection';
import { WaitlistSection } from '../components/sections/WaitlistSection';
import { FooterSection } from '../components/sections/FooterSection';
import { NavBar } from '../components/ui/NavBar';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <PrivacySection />
      <ThemesSection />
      <WaitlistSection />
      <FooterSection />
    </main>
  );
}
