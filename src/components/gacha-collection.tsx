'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Layers, Sparkles, X, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from './ui/badge';
import { RarityBadge } from './rarity-badge';
import { type PrizeResult } from './gacha-button';
import { cn } from '@/lib/utils';


const getCollection = (): PrizeResult[] => {
  if (typeof window === 'undefined') return [];
  try {
    const collectionJSON = localStorage.getItem('gachaCollection');
    return collectionJSON ? JSON.parse(collectionJSON) : [];
  } catch (error) {
    console.error("Failed to read collection from localStorage:", error);
    return [];
  }
};

// Function to remove a prize from the collection
const removeFromCollection = (prizeToRemove: PrizeResult) => {
  if (typeof window === 'undefined') return;
  try {
    const collection = getCollection();
    // Filter out the prize to remove. We match by title and imageUrl as a quasi-unique ID.
    const newCollection = collection.filter(p => !(p.prize.title === prizeToRemove.prize.title && p.imageUrl === prizeToRemove.imageUrl));
    localStorage.setItem('gachaCollection', JSON.stringify(newCollection));
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('collectionUpdated'));
  } catch (error) {
    console.error("Failed to remove prize from collection:", error);
  }
};

export default function GachaCollection() {
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [collection, setCollection] = useState<PrizeResult[]>([]);
  const [selectedPrize, setSelectedPrize] = useState<PrizeResult | null>(null);

  const updateCollection = () => {
    setCollection(getCollection());
  };

  useEffect(() => {
    updateCollection(); // Initial load

    window.addEventListener('collectionUpdated', updateCollection);
    
    return () => {
      window.removeEventListener('collectionUpdated', updateCollection);
    };
  }, []);
  
  const handlePrizeClick = (prize: PrizeResult) => {
    setSelectedPrize(prize);
  };
  
  const handleRemoveClick = (prize: PrizeResult, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the prize detail dialog from opening
    removeFromCollection(prize);
  };

  const getDialogGlowClass = (rarity: PrizeResult['prize']['rarity']) => {
    switch (rarity) {
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
            id="collectionToggle"
            onClick={() => setIsCollectionOpen(true)}
            variant="outline"
            size="icon"
            className="w-14 h-14 bg-background/80 dark:bg-slate-800/80 backdrop-blur-md border rounded-full transition-transform active:scale-90 shadow-lg hover:scale-110"
          >
            <Layers className="h-6 w-6" />
            <span className="sr-only">Buka Koleksi</span>
          </Button>
          {collection.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
              {collection.length}
            </span>
          )}
      </div>

      {/* Main Collection Dialog */}
      <Dialog open={isCollectionOpen} onOpenChange={setIsCollectionOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md h-[70vh] flex flex-col p-0 rounded-2xl">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <Layers />
              Koleksi Hadiah
            </DialogTitle>
            <DialogDescription>
              Ini adalah 5 hadiah terakhir yang Anda dapatkan. Anda bisa menghapus hadiah untuk memberi ruang.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-grow">
            <div className="px-6 pb-6 space-y-4">
              {collection.length > 0 ? (
                collection.map((result, index) => (
                  <div key={index} className="group relative">
                    <button 
                      onClick={() => handlePrizeClick(result)}
                      className="flex items-center gap-4 p-4 rounded-xl border bg-secondary/50 w-full text-left hover:bg-secondary/80 transition-colors"
                    >
                      <div className="relative w-24 h-24 aspect-square rounded-lg overflow-hidden border shadow-md flex-shrink-0">
                          <Image
                              src={result.imageUrl}
                              alt={result.prize.title}
                              fill
                              className="object-cover"
                              sizes="96px"
                          />
                      </div>
                      <div className='w-full space-y-1.5'>
                          <div className="flex flex-wrap gap-2 items-center">
                              <RarityBadge rarity={result.prize.rarity} />
                              {result.isAiGenerated && (
                                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none text-xs">
                                      <Sparkles className="w-3 h-3 mr-1" />
                                      AI
                                  </Badge>
                              )}
                          </div>
                          <h3 className="text-base font-bold line-clamp-2">{result.prize.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 italic">"{result.prize.text}"</p>
                      </div>
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className='flex items-center gap-2'><AlertTriangle/>Apakah Anda Yakin?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini akan menghapus hadiah <span className='font-bold'>{`"${result.prize.title}"`}</span> dari koleksi Anda secara permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={(e) => handleRemoveClick(result, e)}>
                            Ya, Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
                  <p>Koleksi Anda masih kosong.</p>
                  <p>Coba dapatkan hadiah kejutan!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Prize Detail Dialog */}
      <Dialog open={!!selectedPrize} onOpenChange={(open) => !open && setSelectedPrize(null)}>
        {selectedPrize && (
          <DialogContent className={cn("w-[90vw] max-w-[340px] p-4 rounded-2xl transition-all duration-500", getDialogGlowClass(selectedPrize.prize.rarity))}>
            <DialogHeader className="text-center items-center p-2">
              <DialogTitle className="text-xl font-bold">
                  Detail Hadiah
              </DialogTitle>
              <DialogDescription className="text-xs">
                  Ini adalah salah satu hadiah dari koleksimu.
              </DialogDescription>
            </DialogHeader>

            <div className="py-2 space-y-4">
              <div className="flex flex-col items-center text-center space-y-3 animate-in fade-in-50 duration-500">
                <div className="relative w-full max-w-[280px] aspect-[4/3] rounded-lg overflow-hidden border shadow-lg">
                    <Image
                        src={selectedPrize.imageUrl}
                        alt={selectedPrize.prize.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 90vw, 280px"
                    />
                    <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
                        {selectedPrize.isAiGenerated && (
                            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none shadow-lg">
                                <Sparkles className="w-3 h-3 mr-1.5" />
                                Dibuat oleh AI
                            </Badge>
                        )}
                    </div>
                </div>
                <div className='w-full space-y-1.5'>
                    <div className="flex gap-2 justify-center">
                        <RarityBadge rarity={selectedPrize.prize.rarity} />
                        <Badge variant="secondary">{selectedPrize.prize.category}</Badge>
                    </div>
                    <h3 className="text-lg font-bold pt-1">{selectedPrize.prize.title}</h3>
                    <div className="max-h-[5rem] overflow-y-auto custom-scrollbar px-4">
                      <p className="text-sm text-muted-foreground italic">"{selectedPrize.prize.text}"</p>
                    </div>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
