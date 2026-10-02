import { DailyWeatherRaw } from '../types/weather';

export interface SunPhase {
  isDay: 0 | 1;
  isSunriseWindow: boolean;
  isSunsetWindow: boolean;
  isTransition: boolean;
  sunriseStr?: string;
  sunsetStr?: string;
}

/**
 * Parse an ISO local date-time string (e.g. "2026-09-29T18:22")
 * into total minutes from a fixed reference point (Date.UTC).
 */
export function parseIsoMinutes(isoStr?: string): number | null {
  if (!isoStr) return null;
  const [datePart, timePart] = isoStr.split('T');
  if (!datePart || !timePart) return null;
  const [y, m, d] = datePart.split('-').map(Number);
  const [h, min] = timePart.split(':').map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(h)) return null;
  return Date.UTC(y, m - 1, d, h, isNaN(min) ? 0 : min) / 60000;
}

/**
 * Find sunrise and sunset strings for a given timestamp from the daily forecast arrays.
 */
export function getSunriseSunsetForTime(
  timeStr: string,
  daily?: DailyWeatherRaw
): { sunriseStr?: string; sunsetStr?: string } {
  if (!daily || !daily.time || daily.time.length === 0) {
    return {
      sunriseStr: daily?.sunrise?.[0],
      sunsetStr: daily?.sunset?.[0],
    };
  }

  const datePart = timeStr.split('T')[0];
  const dayIdx = daily.time.findIndex((t) => t.startsWith(datePart));
  if (dayIdx !== -1) {
    return {
      sunriseStr: daily.sunrise?.[dayIdx],
      sunsetStr: daily.sunset?.[dayIdx],
    };
  }

  return {
    sunriseStr: daily.sunrise?.[0],
    sunsetStr: daily.sunset?.[0],
  };
}

/**
 * Determine exact SunPhase (day/night, sunrise/sunset window)
 * for any given timestamp based on real sunrise and sunset.
 */
export function calculateSunPhase(
  timeStr: string,
  daily?: DailyWeatherRaw,
  apiIsDay?: number
): SunPhase {
  const { sunriseStr, sunsetStr } = getSunriseSunsetForTime(timeStr, daily);
  const tMins = parseIsoMinutes(timeStr);
  const srMins = parseIsoMinutes(sunriseStr);
  const ssMins = parseIsoMinutes(sunsetStr);

  // Determine isDay:
  // 1. If Open-Meteo provides apiIsDay (from current or hourly), respect it as the astronomical authority
  // 2. Otherwise calculate strictly from time between sunrise and sunset
  // 3. Fallback to hour-based 6am-6pm check
  let isDay: 0 | 1;
  if (apiIsDay !== undefined && apiIsDay !== null) {
    isDay = apiIsDay ? 1 : 0;
  } else if (tMins !== null && srMins !== null && ssMins !== null) {
    isDay = (tMins >= srMins && tMins < ssMins) ? 1 : 0;
  } else {
    const parts = timeStr.split('T');
    if (parts[1]) {
      const h = parseInt(parts[1].split(':')[0], 10);
      isDay = (!isNaN(h) && h >= 6 && h < 18) ? 1 : 0;
    } else {
      isDay = 1;
    }
  }

  // Realistic twilight/transition windows:
  // Dawn/Sunrise: 15 mins before to 10 mins after actual sunrise
  // Sunset/Dusk: 10 mins before to 25 mins after actual sunset
  let isSunriseWindow = false;
  let isSunsetWindow = false;

  if (tMins !== null && srMins !== null && ssMins !== null) {
    const diffSunrise = tMins - srMins; // negative = before sunrise, positive = after sunrise
    const diffSunset = tMins - ssMins;   // negative = before sunset, positive = after sunset

    // Dawn / Sunrise: strictly within [-15, +10] minutes
    isSunriseWindow = diffSunrise >= -15 && diffSunrise <= 10;

    // Sunset / Dusk: strictly within [-10, +25] minutes
    isSunsetWindow = diffSunset >= -10 && diffSunset <= 25;
  } else {
    const parts = timeStr.split('T');
    if (parts[1]) {
      const [h, m] = parts[1].split(':').map(Number);
      isSunriseWindow = h === 6 && m <= 15;
      isSunsetWindow = h === 18 && m <= 25;
    }
  }

  const isTransition = isSunriseWindow || isSunsetWindow;

  return {
    isDay,
    isSunriseWindow,
    isSunsetWindow,
    isTransition,
    sunriseStr,
    sunsetStr,
  };
}
