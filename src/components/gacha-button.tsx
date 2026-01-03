'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { LoaderCircle, Sparkles } from 'lucide-react';
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

type PrizeResult = {
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

const GiftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M4.5 9.75a6 6 0 0 1 11.571-3.262l-4.12 4.122a.75.75 0 0 0 1.06 1.061l4.122-4.12A6 6 0 0 1 19.5 9.75c0 3.314-2.686 6-6 6s-6-2.686-6-6ZM10.5 5.063a7.5 7.5 0 0 0-5.937 9.193l-2.122 2.122a.75.75 0 0 0 1.061 1.06l2.121-2.122a7.5 7.5 0 0 0 10.752-10.752L10.5 5.062Z" clipRule="evenodd" />
        <path d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25c0 1.503.626 2.87 1.649 3.897l-1.02 1.02a.75.75 0 1 0 1.06 1.06l1.02-1.02A5.228 5.228 0 0 0 12 13.5a5.25 5.25 0 0 0 5.25-5.25A5.25 5.25 0 0 0 12 1.5Zm-3.75 5.25a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Z" />
        <path fill="#f87171" d="M11 20.25v-3.375c0-.414.336-.75.75-.75h.5c.414 0 .75.336.75.75v3.375H11Z" />
        <path fill="#ef4444" d="M11.25 16.5a.75.75 0 0 0-.75.75v3.375h4.001v-3.375a.75.75 0 0 0-.75-.75h-2.5Z" />
        <path fill="#fca5a5" d="M11.25 16.125c-.207 0-.406.083-.553.232l-1.447 1.447v-1.804c0-.414.336-.75.75-.75h2.5c.414 0 .75.336.75.75v1.804l-1.447-1.447a.75.75 0 0 0-.553-.232h-.001Z"/>
        <path fill="#dc2626" d="M13.25 21.375a.375.375 0 0 1-.375-.375v-1.125h-1.75v1.125c0 .207.168.375.375.375h1.375Z" />
    </svg>
);


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
         setIsLoading(false); // Make sure to stop loading
         return;
      }
      
      setResult({ 
        prize: response.prize, 
        imageUrl: response.imageUrl,
        isAiGenerated: response.isAiGenerated 
      });

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

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[60]">
        <div className="relative group">
            <Button
              id="gachaToggle"
              onClick={handleGacha}
              disabled={isLoading}
              size="icon"
              className={cn(
                  "w-16 h-16 bg-gradient-to-br from-red-500 to-yellow-500 text-white rounded-full transition-transform active:scale-90 shadow-2xl shadow-red-500/30 group-hover:scale-110",
                  !isLoading && "animate-jiggle"
              )}
            >
              {isLoading ? <LoaderCircle className="h-8 w-8 animate-spin" /> : 
                <div className="w-12 h-12">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-white w-full h-full">
                        <path fillRule="evenodd" d="M11.99 2.5a3.75 3.75 0 0 0-3.322 5.174l-4.28.963a.75.75 0 0 0-.648.733V15a.75.75 0 0 0 .75.75h14.25a.75.75 0 0 0 .75-.75V9.37a.75.75 0 0 0-.648-.733l-4.28-.963A3.75 3.75 0 0 0 11.99 2.5ZM12 4a2.25 2.25 0 0 0-1.995 3.102A.75.75 0 0 0 10.65 8l1.35.303 1.35-.303a.75.75 0 0 0 .644-.895A2.25 2.25 0 0 0 12 4Z" clipRule="evenodd" />
                        <path d="M7.848 10.233 9.37 9.75h5.25l1.524.483c.472.15.776.6.776 1.103v2.914H6.3V11.336c0-.503.304-.953.776-1.103Z" />
                        <path fill="#fca5a5" d="M5.625 15.75h12.75V19.5a.75.75 0 0 1-.75.75H6.375a.75.75 0 0 1-.75-.75v-3.75Z" />
                        <path fill="#ef4444" d="M11.25 15.75v4.5h1.5v-4.5h-1.5Z" />
                    </svg>
                </div>
              }
              <span className="sr-only">Hadiah Kejutan</span>
            </Button>
             <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-primary p-1 items-center justify-center text-white text-[8px] font-bold">
                    BARU
                </span>
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
                    {result.isAiGenerated && (
                      <div className="absolute bottom-2 right-2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none shadow-lg">
                          <Sparkles className="w-3 h-3 mr-1.5" />
                          Dibuat oleh AI
                        </Badge>
                      </div>
                    )}
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
