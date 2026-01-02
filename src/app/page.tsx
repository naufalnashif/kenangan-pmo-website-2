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

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ScrollingBanner />
      <main className="flex-grow">
        <HeroSection />
        <FarewellMessage />
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
