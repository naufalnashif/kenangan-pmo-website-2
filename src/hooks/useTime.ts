'use client';

import { useState, useEffect, useMemo } from 'react';

export function useTime(lastDayString: string) {
  const [timeSince, setTimeSince] = useState({
    currentTime: '--:--:-- --',
    timeSinceLastDay: 'Menghitung...',
  });

  const lastDay = useMemo(() => new Date(lastDayString), [lastDayString]);

  useEffect(() => {
    // This function will run only on the client
    const calculateTime = () => {
      const now = new Date();
      const timeDiff = now.getTime() - lastDay.getTime();
      let timeSinceLastDayValue = 'Menghitung...';

      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        timeSinceLastDayValue = `${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`;
      } else {
        const days = Math.abs(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
        timeSinceLastDayValue = `Tinggal ${days} hari lagi.`;
      }
      
      setTimeSince({
        currentTime: now.toLocaleTimeString(),
        timeSinceLastDay: timeSinceLastDayValue,
      });
    };
    
    // Calculate time immediately on mount
    calculateTime();
    
    // Then update every second
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [lastDay]);

  return timeSince;
}
