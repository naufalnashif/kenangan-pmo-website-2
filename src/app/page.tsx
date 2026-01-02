'use client';

import { Suspense } from 'react';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ScrollingBanner from "@/components/scrolling-banner";
import AudioPlayer from "@/components/audio-player";
import HeroSection from "@/components/sections/hero";
import FarewellMessage from "@/components/sections/farewell-message";
import Guestbook from "@/components/sections/guestbook";
import MemoriesGallery from "@/components/sections/memories-gallery";
import EmoneyGifts from "@/components/sections/emoney-gifts";
import DigitalVault from "@/components/sections/digital-vault";
import AnalyticsDashboard from "@/components/analytics-dashboard";
import WelcomeMessage from '@/components/welcome-message';
import Portfolio from '@/components/sections/portfolio';
import { useSearchParams } from 'next/navigation';
import { specialGuests } from '@/lib/special-guests';

function WelcomeManager() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get('to');

  const isValidGuest = guestName && specialGuests.map(g => g.toLowerCase()).includes(guestName.toLowerCase());

  if (isValidGuest) {
    // Find the original casing of the name
    const originalGuestName = specialGuests.find(g => g.toLowerCase() === guestName.toLowerCase());
    return <WelcomeMessage name={originalGuestName!} />;
  }

  return null;
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <WelcomeManager />
      </Suspense>
      <Header />
      <ScrollingBanner />
      <main className="flex-grow">
        <HeroSection />
        <FarewellMessage />
        <Portfolio />
        <Guestbook />
        <MemoriesGallery />
        <EmoneyGifts />
        <DigitalVault />
        <AnalyticsDashboard />
      </main>
      <Footer />
      <AudioPlayer />
    </div>
  );
}
