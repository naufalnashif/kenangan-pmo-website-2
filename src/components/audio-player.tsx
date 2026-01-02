"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const togglePlayPause = () => {
    if (!hasInteracted) setHasInteracted(true);
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play().catch(e => console.error("Audio playback failed:", e));
      setIsPlaying(true);
    }
  };
  
  // This effect ensures music plays after the first user interaction
  useEffect(() => {
    const playPromise = audioRef.current?.play();
    if(playPromise !== undefined) {
      playPromise.then(() => {
        // Autoplay started
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay was prevented.
        setIsPlaying(false);
      });
    }
  }, [hasInteracted]);

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <div className="bg-background/80 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-full shadow-2xl border flex items-center space-x-3 transition-all hover:scale-105">
        <Button
          id="musicToggle"
          onClick={togglePlayPause}
          size="icon"
          className="w-10 h-10 bg-primary text-primary-foreground rounded-full transition-transform active:scale-90"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          <span className="sr-only">Toggle Music</span>
        </Button>
        <span className="text-[10px] font-bold pr-3 text-muted-foreground uppercase tracking-widest hidden sm:flex items-center gap-2">
            <Music size={12}/>
            Atmosphere
        </span>
      </div>
      <audio
        ref={audioRef}
        id="bgMusic"
        loop
        src="https://www.bensound.com/bensound-music/bensound-memories.mp3"
      />
    </div>
  );
}
