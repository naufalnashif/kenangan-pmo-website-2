'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Gift, LoaderCircle, Sparkles } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { RarityBadge } from './rarity-badge';

export type PrizeResult = {
    prize: GachaPrizeOutput;
    imageUrl: string;
    isAiGenerated?: boolean;
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


// Function to save prize to collection
const saveToCollection = (prizeResult: PrizeResult) => {
  if (typeof window === 'undefined') return;
  try {
    const collectionJSON = localStorage.getItem('gachaCollection');
    let collection: PrizeResult[] = collectionJSON ? JSON.parse(collectionJSON) : [];
    
    // Add the new prize to the start of the array
    collection.unshift(prizeResult);

    // Keep only the last 5 prizes
    if (collection.length > 5) {
      collection = collection.slice(0, 5);
    }

    localStorage.setItem('gachaCollection', JSON.stringify(collection));
    // Dispatch a custom event to notify the collection component
    window.dispatchEvent(new CustomEvent('collectionUpdated'));
  } catch (error) {
    console.error("Failed to save prize to collection:", error);
  }
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
    
    // Check if collection is full
    const collectionJSON = localStorage.getItem('gachaCollection');
    const collection: PrizeResult[] = collectionJSON ? JSON.parse(collectionJSON) : [];
    if (collection.length >= 5) {
      toast({
        variant: 'destructive',
        title: 'Koleksi Penuh!',
        description: 'Hapus beberapa hadiah dari koleksi untuk mendapatkan yang baru.',
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
         setIsLoading(false); // Make sure to stop loading
         return;
      }
      
      const prizeResult = { 
        prize: response.prize, 
        imageUrl: response.imageUrl,
        isAiGenerated: response.isAiGenerated 
      };

      setResult(prizeResult);
      saveToCollection(prizeResult);

    } catch (error: any) {
      console.error('Gacha failed:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Mendapatkan Hadiah',
        description: 'Terjadi kesalahan pada aplikasi. Silakan coba lagi.',
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getDialogGlowClass = () => {
    if (!result) return '';
    switch (result.prize.rarity) {
      case 'Super Epic':
        return 'super-epic-glow';
      case 'Epic':
        return 'epic-glow';
      default:
        return '';
    }
  };

  return (
    <>
      <div className="relative group">
          <Button
            id="gachaToggle"
            onClick={handleGacha}
            disabled={isLoading}
            size="icon"
            className="w-14 h-14 bg-accent text-accent-foreground rounded-full transition-transform active:scale-90 shadow-lg group-hover:scale-110 animate-pulse-shadow"
          >
            {isLoading ? <LoaderCircle className="h-6 w-6 animate-spin" /> : <Gift className="h-6 w-6" />}
            <span className="sr-only">Hadiah Kejutan</span>
          </Button>
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-primary p-1 items-center justify-center text-white text-[8px] font-bold">
                  BARU
              </span>
          </span>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={cn("w-[90vw] max-w-[340px] p-4 rounded-2xl transition-all duration-500", getDialogGlowClass())}>
          <DialogHeader className="text-center items-center p-2">
            <DialogTitle className="text-xl font-bold">
                {isLoading ? 'Mengambil Hadiah...' : 'Selamat! Anda Mendapatkan...'}
            </DialogTitle>
            <DialogDescription className="text-xs">
                {isLoading ? 'Mohon tunggu sebentar, mesin kejutan sedang bekerja.' : 'Sebuah hadiah virtual spesial untuk Anda.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-4">
            {isLoading && (
              <div className="flex flex-col items-center justify-center space-y-4 h-64">
                <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Menghubungi mesin kejutan...</p>
              </div>
            )}
            {result && (
              <div className="flex flex-col items-center text-center space-y-3 animate-in fade-in-50 duration-500">
                <div className="relative w-full max-w-[280px] aspect-[4/3] rounded-lg overflow-hidden border shadow-lg">
                    <Image
                        src={result.imageUrl}
                        alt={result.prize.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 90vw, 280px"
                    />
                    <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
                        {result.isAiGenerated && (
                            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none shadow-lg">
                                <Sparkles className="w-3 h-3 mr-1.5" />
                                Dibuat oleh AI
                            </Badge>
                        )}
                    </div>
                </div>
                <div className='w-full space-y-1.5'>
                    <div className="flex gap-2 justify-center">
                        <RarityBadge rarity={result.prize.rarity} />
                        <Badge variant="secondary">{result.prize.category}</Badge>
                    </div>
                    <h3 className="text-lg font-bold pt-1">{result.prize.title}</h3>
                    <div className="max-h-[5rem] overflow-y-auto custom-scrollbar px-4">
                      <p className="text-sm text-muted-foreground italic">"{result.prize.text}"</p>
                    </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
