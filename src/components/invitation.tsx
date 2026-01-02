'use client';

import { QrCode } from 'lucide-react';
import { Card } from './ui/card';
import { ScrollRevealWrapper } from './scroll-reveal-wrapper';

export default function Invitation() {
  return (
    <ScrollRevealWrapper className="bg-background">
      <div className="relative -mt-24 pb-24 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8 sm:p-12 rounded-[2.5rem] bg-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-2xl text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-6 border border-primary/30">
                    <QrCode className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Dapatkan Pengalaman Personal</h3>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Website ini didesain dengan fitur personalisasi. Scan QR code yang tertera pada kartu e-money edisi perpisahan untuk mendapatkan pesan dan konten khusus yang didedikasikan untuk Anda.
                </p>
            </Card>
        </div>
      </div>
    </ScrollRevealWrapper>
  );
}
