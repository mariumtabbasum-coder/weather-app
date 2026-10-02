/**
 * Formats Open-Meteo local ISO strings without timezone shifts.
 * Strings are in format "YYYY-MM-DDTHH:MM" or "YYYY-MM-DDTHH:MM:SS"
 */

export function parseLocalTimeString(isoString: string): {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
} {
  const [datePart, timePart = '00:00'] = isoString.split('T');
  const [yearStr, monthStr, dayStr] = datePart.split('-');
  const [hoursStr, minutesStr] = timePart.split(':');

  return {
    year: parseInt(yearStr, 10),
    month: parseInt(monthStr, 10),
    day: parseInt(dayStr, 10),
    hours: parseInt(hoursStr, 10),
    minutes: parseInt(minutesStr, 10),
  };
}

export function formatTime12h(isoString: string): string {
  if (!isoString) return '--:--';
  const { hours, minutes } = parseLocalTimeString(isoString);
  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const mm = minutes.toString().padStart(2, '0');
  return `${h12}:${mm} ${period}`;
}

export function formatHourOnly(isoString: string): string {
  if (!isoString) return '--';
  const { hours } = parseLocalTimeString(isoString);
  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${h12} ${period}`;
}

export function getDayOfWeekName(isoString: string, isToday = false): string {
  if (isToday) return 'Today';
  const { year, month, day } = parseLocalTimeString(isoString);
  // Using UTC Date avoids user's browser local timezone shift
  const dateUtc = new Date(Date.UTC(year, month - 1, day));
  return dateUtc.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
}

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatFullDate(isoString: string): string {
  if (!isoString) return '';
  const { year, month, day } = parseLocalTimeString(isoString);
  const dateUtc = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = DAYS_SHORT[dateUtc.getUTCDay()];
  const monthName = MONTHS_SHORT[month - 1] || '';
  return `${dayOfWeek}, ${day} ${monthName} ${year}`;
}

export function formatDateShort(isoString: string): string {
  if (!isoString) return '';
  const { month, day } = parseLocalTimeString(isoString);
  const monthName = MONTHS_SHORT[month - 1] || '';
  return `${day} ${monthName}`;
}

export function getGreeting(currentTimeIso: string): string {
  if (!currentTimeIso) return 'Welcome,';
  const { hours } = parseLocalTimeString(currentTimeIso);
  if (hours >= 5 && hours < 12) return 'Good Morning,';
  if (hours >= 12 && hours < 17) return 'Good Afternoon,';
  if (hours >= 17 && hours < 21) return 'Good Evening,';
  return 'Good Night,';
}

export function convertTemperature(celsius: number, unit: 'celsius' | 'fahrenheit'): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTempWithUnit(celsius: number, unit: 'celsius' | 'fahrenheit'): string {
  const val = convertTemperature(celsius, unit);
  return `${val}°`;
}

export function formatWindSpeed(kmh: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatVisibility(meters: number, unit: 'celsius' | 'fahrenheit'): string {
  if (meters === undefined || meters === null) return '--';
  if (unit === 'fahrenheit') {
    const miles = (meters / 1609.34).toFixed(1);
    return `${miles} mi`;
  }
  const km = Math.round(meters / 1000);
  return `${km} km`;
}

export function formatPressure(hPa: number): string {
  if (!hPa) return '-- hPa';
  return `${Math.round(hPa)} hPa`;
}

export function formatRelativeUpdatedTime(timestamp: number): string {
  const diffMinutes = Math.floor((Date.now() - timestamp) / 60000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes === 1) return '1 minute ago';
  if (diffMinutes < 60) return `${diffMinutes} mins ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return '1 hour ago';
  return `${diffHours} hours ago`;
}
