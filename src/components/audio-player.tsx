"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSeasonalEffects } from '@/hooks/use-seasonal-effects';

const musicTracks = {
  default: "https://www.bensound.com/bensound-music/bensound-memories.mp3",
  snow: "https://www.bensound.com/bensound-music/bensound-betterdays.mp3", // Cheerful, warm
  fireworks: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3", // Optimistic, celebratory
  lanterns: "https://www.bensound.com/bensound-music/bensound-relaxing.mp3" // Calm, peaceful
};

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { activeEffect } = useSeasonalEffects();

  const activeTrack = (activeEffect && musicTracks[activeEffect]) ? musicTracks[activeEffect] : musicTracks.default;

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // The play() method returns a Promise.
      // We can use it to handle autoplay policies.
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        // Autoplay was prevented.
        console.error("Audio playback was prevented by the browser:", error);
        setIsPlaying(false);
      });
    }
  };
  
  // Effect to handle source changes
  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying) {
            // If it was already playing, we want the new track to start playing.
            // We pause, set new src, and then play.
            audioRef.current.pause();
            audioRef.current.src = activeTrack;
            audioRef.current.load(); // It's good practice to load the new source
            audioRef.current.play().catch(e => console.error("Failed to play new track:", e));
        } else {
            // If it wasn't playing, just update the source.
            audioRef.current.src = activeTrack;
        }
    }
  }, [activeTrack]); // This effect runs when activeTrack changes

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
      {/* We set the initial source here and change it via useEffect */}
      <audio
        ref={audioRef}
        id="bgMusic"
        loop
        src={activeTrack}
      />
    </div>
  );
}
