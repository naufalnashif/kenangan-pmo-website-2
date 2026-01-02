'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SpecialGuest } from '@/lib/special-guests';
import { useTime } from '@/hooks/useTime';
import { Clock } from 'lucide-react';

interface HeroSectionProps {
  guest?: SpecialGuest;
}

export default function HeroSection({ guest }: HeroSectionProps) {
  const heroProfileImage = PlaceHolderImages.find(img => img.id === 'hero-profile');
  const { timeSinceLastDay } = useTime('2025-12-31T23:59:59');

  const scrollToMessage = () => {
    document.getElementById('message')?.scrollIntoView({ behavior: 'smooth' });
  };

  const headlineText = guest ? (
    <>
      See You Later, <br />
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">{guest.name}.</span>
    </>
  ) : (
    <>
      See You Later, <br />
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">PMO OJK.</span>
    </>
  );

  return (
    <section id="home" className="relative min-h-screen flex items-center hero-pattern text-white pt-32 sm:pt-40 pb-20 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500 rounded-full filter blur-[80px] sm:blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-600 rounded-full filter blur-[80px] sm:blur-[120px] animate-pulse"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 sm:gap-16 items-center z-10">
        <div className="text-center lg:text-left">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            {guest ? guest.title : 'Final Chapter in OJK'}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-8">
            {headlineText}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Sebuah kehormatan bisa berkontribusi di Workstream Sistem Informasi. Perjalanan ini resmi berakhir, namun kolaborasi kita akan selalu saya kenang.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <Button onClick={scrollToMessage} size="lg" className="px-8 py-4 rounded-2xl text-base font-bold hover:scale-105 transition-transform shadow-xl active:scale-95 bg-white text-slate-900 hover:bg-slate-200">
              Buka Pesan
            </Button>
            {guest && (
              <Button asChild variant="secondary" size="lg" className="px-8 py-4 rounded-2xl text-base font-bold hover:scale-105 transition-transform shadow-xl active:scale-95 bg-slate-800/50 text-white border border-slate-700 hover:bg-slate-700">
                <Link href="#drive">Aset Digital</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center order-first lg:order-last">
          <div className="relative w-full max-w-[320px] sm:max-w-[450px] animate-float">
            <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] sm:rounded-[3.5rem] blur-3xl opacity-50"></div>
            {heroProfileImage && (
              <Image 
                src={heroProfileImage.imageUrl}
                alt="Main Profile" 
                width={450}
                height={450}
                priority
                className="relative rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/10 shadow-2xl w-full aspect-square object-cover"
                data-ai-hint={heroProfileImage.imageHint}
              />
            )}
          </div>
          <div className="mt-8 text-center bg-black/20 backdrop-blur-sm border border-white/10 p-3 rounded-2xl">
              <p className="text-xs text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={12}/>
                Waktu Tidak Berjumpa
              </p>
              <p className="text-sm font-bold text-slate-200 mt-1">{timeSinceLastDay}</p>
            </div>
        </div>
      </div>
    </section>
  );
}
