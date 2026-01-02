'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ScrollRevealWrapper } from '../scroll-reveal-wrapper';

export default function FarewellMessage() {
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const logo = PlaceHolderImages.find(img => img.id === 'logo');

  const toggleMessage = () => {
    const messageSection = document.getElementById('message');
    if (!isMessageOpen && messageSection) {
      window.scrollTo({
        top: messageSection.offsetTop - 120,
        behavior: 'smooth'
      });
    }
    setIsMessageOpen(!isMessageOpen);
  };

  return (
    <ScrollRevealWrapper id="message" className="py-32 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">A Personal Note</h2>
          <h3 className="text-4xl font-extrabold text-foreground">Pesan Dari Naufal Nashif</h3>
        </div>

        <div className="message-container relative h-[450px]">
          {/* Cover Card */}
          <div 
            className={cn(
              "absolute inset-0 transition-transform duration-700 ease-in-out",
              isMessageOpen && "pointer-events-none -z-10 [transform:rotateX(180deg)]"
            )}
            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
          >
            <div 
              onClick={toggleMessage}
              className="bg-gradient-to-br from-primary to-blue-900 p-1 rounded-[2.5rem] shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform group h-full"
            >
              <div className="bg-slate-900 rounded-[2.3rem] p-12 flex flex-col items-center justify-center text-center h-full">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 group-hover:animate-bounce">
                  <Mail className="h-10 w-10 text-blue-400" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">You have a new message</h4>
                <p className="text-slate-400 mb-8">Klik untuk membuka pesan perpisahan khusus untuk rekan PMO.</p>
                <Button onClick={toggleMessage} className="bg-accent text-accent-foreground hover:bg-accent/90">Buka Sekarang</Button>
              </div>
            </div>
          </div>

          {/* Actual Message Content */}
          <div 
            className={cn(
              "absolute inset-0 transition-transform duration-700 ease-in-out",
              !isMessageOpen && "[transform:rotateX(-180deg)] -z-10"
            )}
            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
          >
            <div className="bg-background rounded-[2.5rem] p-8 md:p-12 shadow-2xl border h-full overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-10">
                {logo && (
                  <Image src={logo.imageUrl} alt="logo" width={48} height={48} className="h-12 w-12 opacity-50 dark:invert" data-ai-hint={logo.imageHint} />
                )}
                <Button onClick={toggleMessage} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                  <X className="h-8 w-8" />
                </Button>
              </div>
              <div className="space-y-6 text-justify text-slate-600 dark:text-slate-300">
                <p className="text-xl font-bold text-foreground mb-6">Rekan-rekan PMO OJK yang Luar Biasa,</p>
                <p>Bekerja di Workstream Sistem Informasi bukan hanya tentang angka dan proyek, tapi tentang koneksi dan integritas. Saya berterima kasih atas setiap kesempatan belajar yang diberikan.</p>
                <p>Sebagai langkah selanjutnya, saya akan berkarya di dunia konsultansi. Semoga semangat inovasi yang kita bangun di sini terus berkobar di hati rekan-rekan semua.</p>
                <div className="my-10 p-6 md:p-8 bg-primary/10 rounded-3xl border-l-8 border-primary italic">
                  "Farewell is just a way to say we will miss the presence, but not the memories."
                </div>
                <p>Tetap sukses, tetap sehat, dan tetaplah menjadi penggerak perubahan.</p>
                <div className="mt-12 pt-8 border-t">
                  <p className="text-muted-foreground text-sm font-bold uppercase mb-2">Hormat Saya,</p>
                  <p className="text-3xl font-black text-primary">Naufal Nashif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollRevealWrapper>
  );
}
