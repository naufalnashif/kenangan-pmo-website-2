'use client';

import { useSeasonalEffects } from '@/hooks/use-seasonal-effects';

const Lanterns = () => (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[999] overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="absolute bg-amber-400 rounded-full animate-float" style={{
                width: `${Math.random() * (40 - 10) + 10}px`,
                height: `${Math.random() * (40 - 10) + 10}px`,
                left: `${Math.random() * 100}%`,
                bottom: '-50px',
                animationDuration: `${Math.random() * (25 - 10) + 10}s`,
                animationDelay: `${Math.random() * 10}s`,
                opacity: Math.random() * (0.7 - 0.3) + 0.3,
                filter: 'blur(5px)',
            }} />
        ))}
    </div>
);

const Fireworks = () => (
  <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[999] overflow-hidden">
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        className="firework"
        style={{
          '--firework-color-1': `hsl(${Math.random() * 360}, 100%, 50%)`,
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 90 + 5}%`,
          transform: `scale(${Math.random() * 0.5 + 0.5})`,
          animation: `firework-anim 2s ${Math.random() * 2}s ease-out infinite`,
        } as React.CSSProperties}
      ></div>
    ))}
  </div>
);

const Snowfall = () => (
  <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[999] overflow-hidden">
    {Array.from({ length: 200 }).map((_, i) => (
      <div
        key={i}
        className="absolute bg-white rounded-full animate-snowfall"
        style={{
          width: `${Math.random() * 5 + 2}px`,
          height: `${Math.random() * 5 + 2}px`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 10 + 5}s`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: Math.random() * 0.7 + 0.3,
        }}
      />
    ))}
  </div>
);


export default function SeasonalEffects() {
  const { activeEffect } = useSeasonalEffects();

  if (!activeEffect) {
    return null;
  }

  switch (activeEffect) {
    case 'snow':
      return <Snowfall />;
    case 'fireworks':
      return <Fireworks />;
    case 'lanterns':
      return <Lanterns />;
    default:
      return null;
  }
}
