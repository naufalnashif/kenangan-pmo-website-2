"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, ListMusic, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const musicTracks = [
  { title: "Memories", url: "https://www.bensound.com/bensound-music/bensound-memories.mp3" },
  { title: "Creative Minds", url: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3" },
  { title: "A New Beginning", url: "https://www.bensound.com/bensound-music/bensound-anewbeginning.mp3" },
  { title: "Better Days", url: "https://www.bensound.com/bensound-music/bensound-betterdays.mp3" },
  { title: "Relaxing", url: "https://www.bensound.com/bensound-music/bensound-relaxing.mp3" }
];


export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const activeTrack = musicTracks[currentTrackIndex];

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        // Handle cases where autoplay is blocked
        console.error("Audio playback was prevented by the browser:", error);
        setIsPlaying(false);
      });
    }
  };
  
  const handleTrackChange = (index: number) => {
    if (index === currentTrackIndex) return;

    setCurrentTrackIndex(index);
    // isPlaying state will determine if it plays in the useEffect below
  };
  
  // Effect to handle track changes and autoplay
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.src = musicTracks[currentTrackIndex].url;
        if (isPlaying) {
            // The play() request returns a promise. We'll handle it to avoid uncaught promise errors.
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Failed to play new track automatically:", error);
                    // If play fails, we should probably update the state to reflect that.
                    setIsPlaying(false);
                });
            }
        }
    }
  }, [currentTrackIndex]);


  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <div className="bg-background/80 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-full shadow-2xl border flex items-center space-x-2 transition-all hover:scale-105">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              id="playlistToggle"
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full"
            >
              <ListMusic className="h-5 w-5" />
              <span className="sr-only">Buka Playlist</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56 mb-2' side="top" align="end">
            <DropdownMenuLabel>Pilih Lagu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {musicTracks.map((track, index) => (
              <DropdownMenuItem key={index} onClick={() => handleTrackChange(index)}>
                {currentTrackIndex === index && <Check className="h-4 w-4 mr-2" />}
                <span className={currentTrackIndex !== index ? 'ml-6' : ''}>{track.title}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          id="musicToggle"
          onClick={togglePlayPause}
          size="icon"
          className="w-10 h-10 bg-primary text-primary-foreground rounded-full transition-transform active:scale-90"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          <span className="sr-only">Toggle Music</span>
        </Button>
      </div>
      <audio
        ref={audioRef}
        id="bgMusic"
        loop
        src={activeTrack.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
            const nextIndex = (currentTrackIndex + 1) % musicTracks.length;
            handleTrackChange(nextIndex);
        }}
      />
    </div>
  );
}
