'use client';

import { useState, useEffect } from 'react';

export type HolidayEffect = 'snow' | 'fireworks' | 'lanterns';

type Holiday = {
  name: string;
  month: number; // 1-12
  day: number;
  effect: HolidayEffect;
};

// Year is set to a non-leap year as a base. The check logic will handle the current year.
const holidays: Holiday[] = [
  { name: 'New Year', month: 1, day: 1, effect: 'fireworks' },
  { name: 'Nyepi', month: 3, day: 11, effect: 'lanterns' }, // Example for 2024, changes yearly
  { name: 'Eid al-Fitr', month: 4, day: 10, effect: 'lanterns' }, // Example for 2024, changes yearly
  { name: 'Christmas', month: 12, day: 25, effect: 'snow' },
];

const getActiveHoliday = (currentDate: Date): Holiday | null => {
  const currentYear = currentDate.getFullYear();
  
  for (const holiday of holidays) {
    // Note: This logic is simple and works for fixed-date holidays.
    // For moving holidays like Eid or Nyepi, a more complex library would be needed.
    const holidayDate = new Date(currentYear, holiday.month - 1, holiday.day);
    const fourteenDaysAfter = new Date(holidayDate);
    fourteenDaysAfter.setDate(holidayDate.getDate() + 14);

    if (currentDate >= holidayDate && currentDate <= fourteenDaysAfter) {
      return holiday;
    }
  }
  return null;
};


export function useSeasonalEffects() {
  const [activeEffect, setActiveEffect] = useState<HolidayEffect | null>(null);

  useEffect(() => {
    // This code runs only on the client
    const today = new Date();
    const activeHoliday = getActiveHoliday(today);
    if (activeHoliday) {
      setActiveEffect(activeHoliday.effect);
    }
  }, []);

  return { activeEffect };
}
