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
import { specialGuests, SpecialGuest } from '@/lib/special-guests';
import GachaButton from '@/components/gacha-button';
import SeasonalEffects from '@/components/seasonal-effects';


function PageContent() {
  const searchParams = useSearchParams();
  const guestNameParam = searchParams.get('to');

  const guest: SpecialGuest | undefined = specialGuests.find(g => g.id.toLowerCase() === guestNameParam?.toLowerCase());

  return (
    <>
      <SeasonalEffects />
      <WelcomeMessage guest={guest} />
      <Header />
      <ScrollingBanner />
      <main className="flex-grow">
        <HeroSection guest={guest} />
        <FarewellMessage guest={guest} />
        <Portfolio />
        <Guestbook />
        <MemoriesGallery />
        <EmoneyGifts />
        {guest && <DigitalVault />}
        <AnalyticsDashboard />
      </main>
      <Footer />
      <GachaButton />
      <AudioPlayer />
    </>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center">Loading personal experience...</div>}>
        <PageContent />
      </Suspense>
    </div>
  );
}
