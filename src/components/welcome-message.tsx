'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';

interface WelcomeMessageProps {
  name: string;
}

export default function WelcomeMessage({ name }: WelcomeMessageProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Delay opening the dialog slightly to allow the page to render
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-primary/50 text-white">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-6 border border-primary/30">
            <Gift className="h-8 w-8 text-accent" />
          </div>
          <DialogTitle className="text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
            Welcome, {name}!
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400 pt-2 text-base">
            Terima kasih sudah menjadi bagian dari perjalanan ini. Halaman ini didedikasikan untukmu.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <p className='text-center text-slate-300'>Semoga semua kenangan baik kita tetap tersimpan. Enjoy the memories!</p>
        </div>
        <div className='flex justify-center'>
            <Button onClick={() => setIsOpen(false)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Mulai Menjelajah
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
