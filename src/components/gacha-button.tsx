'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Gift, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { generateGachaPrize, GachaPrizeOutput } from '@/ai/flows/gacha-flow';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';

const DAILY_LIMIT = 5;

type PrizeResult = {
    prize: GachaPrizeOutput;
    imageUrl: string;
}

export default function GachaButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PrizeResult | null>(null);
  const [claimsLeft, setClaimsLeft] = useState(DAILY_LIMIT);
  const { toast } = useToast();

  useEffect(() => {
    // This effect runs only on the client
    const today = new Date().toISOString().split('T')[0];
    const lastClaimStr = localStorage.getItem('gachaLastClaim');
    const claimsCount = parseInt(localStorage.getItem('gachaClaimsCount') || '0', 10);

    if (lastClaimStr === today) {
      setClaimsLeft(Math.max(0, DAILY_LIMIT - claimsCount));
    } else {
      // It's a new day, reset the counter
      localStorage.setItem('gachaClaimsCount', '0');
      localStorage.setItem('gachaLastClaim', today);
      setClaimsLeft(DAILY_LIMIT);
    }
  }, []);

  const handleGacha = async () => {
    if (claimsLeft <= 0) {
      toast({
        variant: 'destructive',
        title: 'Limit Hadiah Harian Tercapai',
        description: 'Anda telah mencapai batas pengambilan hadiah untuk hari ini. Coba lagi besok ya!',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setIsOpen(true);
    
    try {
      const prizeResult = await generateGachaPrize();
      setResult(prizeResult);

      // Update local storage for rate limiting
      const currentClaims = parseInt(localStorage.getItem('gachaClaimsCount') || '0', 10) + 1;
      localStorage.setItem('gachaClaimsCount', currentClaims.toString());
      setClaimsLeft(DAILY_LIMIT - currentClaims);

    } catch (error) {
      console.error('Gacha failed:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Mendapatkan Hadiah',
        description: 'Mesin kejutan sedang sibuk atau kehabisan energi. Silakan coba lagi beberapa saat lagi.',
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[60]">
        <div className="relative bg-background/80 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-full shadow-2xl border flex items-center space-x-3 transition-all hover:scale-105">
            <Button
              id="gachaToggle"
              onClick={handleGacha}
              disabled={isLoading || claimsLeft <= 0}
              size="icon"
              className="w-10 h-10 bg-accent text-accent-foreground rounded-full transition-transform active:scale-90"
            >
              {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Gift className="h-5 w-5" />}
              <span className="sr-only">Hadiah Kejutan</span>
            </Button>
            <span className="text-[10px] font-bold pr-3 text-muted-foreground uppercase tracking-widest hidden sm:flex items-center gap-2">
                Kejutan
            </span>
            {claimsLeft > 0 && claimsLeft < DAILY_LIMIT && (
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {claimsLeft}
              </div>
            )}
             {claimsLeft <= 0 && (
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                !
              </div>
            )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[425px] rounded-2xl">
          <DialogHeader className="text-center items-center">
            <DialogTitle className="text-2xl font-bold">
                {isLoading ? 'Mengambil Hadiah...' : 'Selamat! Anda Mendapatkan...'}
            </DialogTitle>
            <DialogDescription>
                {isLoading ? 'Mohon tunggu sebentar, mesin kejutan sedang bekerja.' : 'Sebuah hadiah virtual spesial untuk Anda.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center space-y-4 h-64">
                <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Menghasilkan teks unik...</p>
              </div>
            )}
            {result && (
              <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in-50 duration-500">
                <div className="relative w-full max-w-[300px] aspect-[4/3] rounded-lg overflow-hidden border shadow-lg">
                    <Image
                        src={result.imageUrl}
                        alt={result.prize.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 90vw, 300px"
                    />
                </div>
                <div className='w-full'>
                    <Badge variant="secondary">{result.prize.category}</Badge>
                    <h3 className="text-xl font-bold pt-2">{result.prize.title}</h3>
                    <p className="text-muted-foreground italic">"{result.prize.text}"</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
