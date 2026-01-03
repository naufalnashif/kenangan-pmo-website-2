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
import { v4 as uuidv4 } from 'uuid'; // For generating unique user ID

type PrizeResult = {
    prize: GachaPrizeOutput;
    imageUrl: string;
}

// Function to get or create a unique user ID
const getUserId = () => {
  let userId = localStorage.getItem('anonymousUserId');
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('anonymousUserId', userId);
  }
  return userId;
};


export default function GachaButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PrizeResult | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // This effect runs only on the client
    setUserId(getUserId());
  }, []);

  const handleGacha = async () => {
    if (!userId) {
        toast({
            variant: 'destructive',
            title: 'Gagal Mengidentifikasi Anda',
            description: 'Mohon refresh halaman dan coba lagi.',
        });
        return;
    }

    setIsLoading(true);
    setResult(null);
    setIsOpen(true);
    
    try {
      const response = await generateGachaPrize({ userId });
      
      if (response.error || !response.prize || !response.imageUrl) {
         toast({
            variant: 'destructive',
            title: 'Gagal Mengambil Hadiah',
            description: response.error || 'Mesin kejutan sedang bermasalah.',
         });
         setIsOpen(false);
         return;
      }
      
      setResult({ prize: response.prize, imageUrl: response.imageUrl });

    } catch (error: any) {
      console.error('Gacha failed:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Mendapatkan Hadiah',
        description: error.message || 'Mesin kejutan sedang sibuk. Silakan coba lagi beberapa saat lagi.',
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
              disabled={isLoading}
              size="icon"
              className="w-10 h-10 bg-accent text-accent-foreground rounded-full transition-transform active:scale-90"
            >
              {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Gift className="h-5 w-5" />}
              <span className="sr-only">Hadiah Kejutan</span>
            </Button>
            <span className="text-[10px] font-bold pr-3 text-muted-foreground uppercase tracking-widest hidden sm:flex items-center gap-2">
                Kejutan
            </span>
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
                <p className="text-muted-foreground">Menghubungi mesin kejutan...</p>
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
