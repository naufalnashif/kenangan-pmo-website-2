'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, QrCode } from 'lucide-react';

interface WelcomeMessageProps {
  name?: string;
}

export default function WelcomeMessage({ name }: WelcomeMessageProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // A state to prevent showing the dialog on subsequent navigations within the app
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Only show the dialog if it hasn't been shown before in this session
    if (sessionStorage.getItem('welcomeMessageShown')) {
      return;
    }
    
    // Delay opening the dialog slightly to allow the page to render
    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem('welcomeMessageShown', 'true');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
  };

  const isSpecialGuest = !!name;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[450px] bg-slate-900 border-primary/50 text-white">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-6 border border-primary/30">
            {isSpecialGuest ? (
              <Gift className="h-8 w-8 text-accent" />
            ) : (
              <QrCode className="h-8 w-8 text-accent" />
            )}
          </div>
          <DialogTitle className="text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
            {isSpecialGuest ? `Welcome, ${name}!` : 'Selamat Datang!'}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400 pt-4 text-base leading-relaxed">
            {isSpecialGuest
              ? 'Terima kasih sudah menjadi bagian dari perjalanan ini. Halaman ini didedikasikan untukmu.'
              : 'Website ini memiliki pengalaman personal yang lebih mendalam. Scan QR code pada kartu e-money Anda untuk mendapatkan akses eksklusif.'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className='text-center text-slate-300'>
            {isSpecialGuest ? 'Semoga semua kenangan baik kita tetap tersimpan. Enjoy the memories!' : 'Jelajahi kenangan dan pesan yang ada di sini.'}
          </p>
        </div>
        <div className='flex justify-center'>
            <Button onClick={handleClose} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isSpecialGuest ? 'Mulai Menjelajah' : 'Lanjutkan'}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
