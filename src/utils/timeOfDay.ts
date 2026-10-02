/**
 * Dynamic Time-of-Day Background Engine for SkyCast
 * Calculates the local time period and provides Tailwind CSS gradients,
 * inline styles, celestial body metadata, and contrast scrims.
 */

export type TimeOfDayPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeOfDayTheme {
  period: TimeOfDayPeriod;
  label: string;
  timeRange: string;
  // Tailwind CSS background gradient classes
  gradientClass: string;
  // Fallback / precise CSS linear-gradient string
  gradientStyle: string;
  // Semi-transparent overlay to guarantee high-contrast white text readability
  scrimOverlayClass: string;
  scrimOverlayStyle: string;
  // Celestial body indicators
  celestialType: 'sun' | 'moon';
  sunElevation: 'low-rising' | 'high' | 'setting' | 'none';
  hasStars: boolean;
  accentColor: string;
  glowColor: string;
  description: string;
}

export const TIME_OF_DAY_THEMES: Record<TimeOfDayPeriod, TimeOfDayTheme> = {
  morning: {
    period: 'morning',
    label: 'Morning Sky',
    timeRange: '6:00 AM – 11:59 AM',
    gradientClass: 'bg-gradient-to-b from-sky-400 via-amber-200 to-orange-300 text-white',
    gradientStyle: 'linear-gradient(180deg, #0284C7 0%, #38BDF8 35%, #FDE047 75%, #FB923C 100%)',
    scrimOverlayClass: 'bg-gradient-to-b from-slate-950/20 via-slate-900/40 to-slate-950/70',
    scrimOverlayStyle: 'linear-gradient(180deg, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.45) 60%, rgba(15, 23, 42, 0.7) 100%)',
    celestialType: 'sun',
    sunElevation: 'low-rising',
    hasStars: false,
    accentColor: '#F59E0B',
    glowColor: 'rgba(251, 191, 36, 0.45)',
    description: 'Bright morning sky with a rising sun and soft golden light',
  },
  afternoon: {
    period: 'afternoon',
    label: 'Vibrant Daytime',
    timeRange: '12:00 PM – 4:59 PM',
    gradientClass: 'bg-gradient-to-b from-blue-600 via-sky-400 to-indigo-300 text-white',
    gradientStyle: 'linear-gradient(180deg, #0284C7 0%, #0EA5E9 35%, #38BDF8 70%, #818CF8 100%)',
    scrimOverlayClass: 'bg-gradient-to-b from-slate-950/25 via-slate-900/40 to-slate-950/70',
    scrimOverlayStyle: 'linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0.65) 100%)',
    celestialType: 'sun',
    sunElevation: 'high',
    hasStars: false,
    accentColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    description: 'Vibrant daytime sky, bright zenith sun, and clear daylight hues',
  },
  evening: {
    period: 'evening',
    label: 'Golden Hour / Sunset',
    timeRange: '5:00 PM – 6:59 PM',
    gradientClass: 'bg-gradient-to-b from-purple-900 via-pink-600 to-amber-500 text-white',
    gradientStyle: 'linear-gradient(180deg, #3B0764 0%, #701A75 25%, #BE185D 50%, #EA580C 75%, #F59E0B 100%)',
    scrimOverlayClass: 'bg-gradient-to-b from-purple-950/30 via-slate-900/45 to-slate-950/75',
    scrimOverlayStyle: 'linear-gradient(180deg, rgba(59, 7, 100, 0.25) 0%, rgba(15, 23, 42, 0.45) 50%, rgba(15, 23, 42, 0.75) 100%)',
    celestialType: 'sun',
    sunElevation: 'setting',
    hasStars: false,
    accentColor: '#F97316',
    glowColor: 'rgba(234, 88, 12, 0.5)',
    description: 'Warm sunset and golden hour with vivid orange, purple, and magenta gradients',
  },
  night: {
    period: 'night',
    label: 'Starry Night',
    timeRange: '7:00 PM – 5:59 AM',
    gradientClass: 'bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white',
    gradientStyle: 'linear-gradient(180deg, #050714 0%, #0B1120 35%, #1E1B4B 70%, #2E1065 100%)',
    scrimOverlayClass: 'bg-gradient-to-b from-slate-950/30 via-slate-950/50 to-slate-950/80',
    scrimOverlayStyle: 'linear-gradient(180deg, rgba(5, 7, 20, 0.3) 0%, rgba(15, 23, 42, 0.55) 60%, rgba(15, 23, 42, 0.8) 100%)',
    celestialType: 'moon',
    sunElevation: 'none',
    hasStars: true,
    accentColor: '#818CF8',
    glowColor: 'rgba(129, 140, 248, 0.3)',
    description: 'Deep midnight sky illuminated by a glowing moon and stars',
  },
};

/**
 * Extracts the 24-hour hour number (0 to 23) from:
 * 1. ISO string (e.g. "2026-10-02T14:30" or "2026-10-02T06:15:00Z")
 * 2. Time string (e.g. "14:30" or "7:15 PM")
 * 3. Date object (with optional timezone offset in seconds or minutes)
 * 4. Raw hour number (0-23)
 */
export function extractLocalHour(
  timeInput?: string | Date | number | null,
  utcOffsetSeconds?: number
): number {
  if (timeInput === null || timeInput === undefined) {
    return new Date().getHours();
  }

  // If already a number
  if (typeof timeInput === 'number') {
    if (timeInput >= 0 && timeInput <= 23) {
      return Math.floor(timeInput);
    }
    // If it's a millisecond timestamp
    const dateFromMs = new Date(timeInput);
    return dateFromMs.getHours();
  }

  // If Date instance
  if (timeInput instanceof Date) {
    if (typeof utcOffsetSeconds === 'number') {
      const utcMs = timeInput.getTime() + timeInput.getTimezoneOffset() * 60000;
      const targetDate = new Date(utcMs + utcOffsetSeconds * 1000);
      return targetDate.getHours();
    }
    return timeInput.getHours();
  }

  // If string
  if (typeof timeInput === 'string') {
    const trimmed = timeInput.trim();

    // Check for ISO format with 'T': e.g. "2026-10-02T14:30"
    if (trimmed.includes('T')) {
      const timePart = trimmed.split('T')[1];
      if (timePart) {
        const hour = parseInt(timePart.split(':')[0], 10);
        if (!isNaN(hour)) return (hour + 24) % 24;
      }
    }

    // Check for 12-hour format with AM/PM: e.g. "6:30 AM" or "07:15 PM"
    const ampmMatch = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (ampmMatch) {
      let h = parseInt(ampmMatch[1], 10);
      const isPm = ampmMatch[3].toUpperCase() === 'PM';
      if (isPm && h < 12) h += 12;
      if (!isPm && h === 12) h = 0;
      return h;
    }

    // Check for "HH:MM"
    const colonMatch = trimmed.match(/(\d{1,2}):(\d{2})/);
    if (colonMatch) {
      const h = parseInt(colonMatch[1], 10);
      if (!isNaN(h)) return (h + 24) % 24;
    }

    // Fallback: parse as standard Date
    const parsedDate = new Date(trimmed);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.getHours();
    }
  }

  return new Date().getHours();
}

/**
 * Determines the TimeOfDayPeriod based on the local hour:
 * - Morning:   6:00 AM to 11:59 AM  (hour >= 6 && hour < 12)
 * - Afternoon: 12:00 PM to 4:59 PM  (hour >= 12 && hour < 17)
 * - Evening:   5:00 PM to 6:59 PM   (hour >= 17 && hour < 19)
 * - Night:     7:00 PM to 5:59 AM   (hour >= 19 || hour < 6)
 */
export function getTimeOfDayPeriod(hour: number): TimeOfDayPeriod {
  if (hour >= 6 && hour < 12) {
    return 'morning';
  }
  if (hour >= 12 && hour < 17) {
    return 'afternoon';
  }
  if (hour >= 17 && hour < 19) {
    return 'evening';
  }
  return 'night';
}

/**
 * Primary API: Returns the full dynamic background theme configuration
 * based on the searched city's current local time or timezone offset.
 *
 * @param timeInput - Local time ISO string, Date object, or hour
 * @param utcOffsetSeconds - Optional timezone offset in seconds (e.g. from Open-Meteo or weather API)
 * @returns TimeOfDayTheme object with gradients, classes, celestial details, and styling
 */
export function getTimeOfDayTheme(
  timeInput?: string | Date | number | null,
  utcOffsetSeconds?: number
): TimeOfDayTheme {
  const hour = extractLocalHour(timeInput, utcOffsetSeconds);
  const period = getTimeOfDayPeriod(hour);
  return TIME_OF_DAY_THEMES[period];
}
