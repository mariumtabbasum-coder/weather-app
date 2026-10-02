import { AirQualityRaw, CityLocation, CurrentWeatherRaw, DailyWeatherRaw, HourlyWeatherRaw, WeatherData } from '../types/weather';
import { getCapitalForCountry, isCountryResult, getFeaturePriority } from '../utils/countryCapitals';

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache
const weatherMemoryCache = new Map<string, { data: WeatherData; timestamp: number }>();

function getCacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(3)},${lon.toFixed(3)}`;
}

/**
 * Fetch with automatic 10s timeout and AbortController chaining
 */
async function fetchWithTimeout(url: string, signal?: AbortSignal, timeoutMs = 10000): Promise<Response> {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('No internet connection. Please check your network and try again.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new Error('The request took too long. Please try again.'));
  }, timeoutMs);

  const onParentAbort = () => controller.abort();
  if (signal) {
    signal.addEventListener('abort', onParentAbort);
  }

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener('abort', onParentAbort);
    }
    if (err instanceof Error) {
      if (err.name === 'AbortError' && controller.signal.aborted && !signal?.aborted) {
        throw new Error('The request took too long. Please try again.');
      }
      if (err.message.includes('Failed to fetch') || err instanceof TypeError) {
        throw new Error('No internet connection. Please check your network and try again.');
      }
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener('abort', onParentAbort);
    }
  }
}

/**
 * Search cities using Open-Meteo Geocoding
 * Ranks populated places (cities/towns) over country-level results,
 * and maps country-level selections to their actual capital city coordinates.
 */
export async function searchCities(query: string, signal?: AbortSignal): Promise<CityLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('No internet connection. Please check your network and try again.');
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  try {
    const response = await fetchWithTimeout(url, signal, 8000);
    if (!response.ok) {
      throw new Error(`Location search failed with status ${response.status}`);
    }
    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    interface RawGeocodingResult {
      id: number;
      name: string;
      country?: string;
      country_code?: string;
      admin1?: string;
      latitude: number;
      longitude: number;
      feature_code?: string;
      population?: number;
    }

    const mappedResults: CityLocation[] = data.results.map((r: RawGeocodingResult) => {
      const isCountry = isCountryResult(r.feature_code, r.name, r.country);
      const capital = isCountry ? getCapitalForCountry(r.country_code, r.country || r.name) : null;

      return {
        id: r.id,
        name: r.name,
        country: r.country || '',
        country_code: r.country_code,
        admin1: isCountry && capital ? `Capital: ${capital.capital}` : r.admin1,
        // Auto-select actual capital coordinates instead of arbitrary territorial centroid
        latitude: isCountry && capital ? capital.latitude : r.latitude,
        longitude: isCountry && capital ? capital.longitude : r.longitude,
        isCountry,
        capitalName: capital ? capital.capital : undefined,
        feature_code: r.feature_code,
        population: r.population,
      };
    });

    // Score match relevance to filter out obscure alternate name hits
    const getMatchScore = (name: string, q: string): number => {
      const n = name.trim().toLowerCase();
      const target = q.trim().toLowerCase();
      if (n === target) return 100;
      if (n.startsWith(target)) return 80;
      if (n.includes(target)) return 50;
      return 10;
    };

    // Rank results: prefer actual cities/towns over countries and large administrative divisions,
    // while keeping direct name matches ahead of obscure alternate-name hits.
    mappedResults.sort((a, b) => {
      const matchA = getMatchScore(a.name, trimmed);
      const matchB = getMatchScore(b.name, trimmed);

      // Penalize results where the primary name does not even contain the search query
      if (matchA >= 50 && matchB < 50) return -1;
      if (matchB >= 50 && matchA < 50) return 1;

      // Prefer cities and populated places
      const priorityA = getFeaturePriority(a.feature_code);
      const priorityB = getFeaturePriority(b.feature_code);
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }

      return (b.population || 0) - (a.population || 0);
    });

    return mappedResults.slice(0, 6);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    throw err;
  }
}

/**
 * Reverse geocode coordinates or fallback to formatted coordinates
 */
export async function reverseGeocode(lat: number, lon: number, signal?: AbortSignal): Promise<CityLocation> {
  const fallbackLocation: CityLocation = {
    id: Math.round(lat * 1000 + lon),
    name: `Selected location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
    country: '',
    latitude: lat,
    longitude: lon,
  };

  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && !navigator.onLine) {
    return fallbackLocation;
  }

  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const response = await fetchWithTimeout(url, signal, 6000);
    if (response.ok) {
      const data = await response.json();
      const placeName =
        data.city ||
        data.locality ||
        data.principalSubdivision ||
        data.countryName ||
        `Selected location (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
      const countryName = data.countryName || '';
      return {
        id: Math.round(lat * 1000 + lon),
        name: placeName,
        country: countryName,
        admin1: data.principalSubdivision,
        latitude: lat,
        longitude: lon,
      };
    }
  } catch {
    // Graceful fallback
  }

  return fallbackLocation;
}

/**
 * Fetch Forecast + Air Quality in parallel
 */
export async function fetchWeatherData(
  city: CityLocation,
  signal?: AbortSignal,
  ignoreCache = false
): Promise<WeatherData> {
  const cacheKey = getCacheKey(city.latitude, city.longitude);
  const cached = weatherMemoryCache.get(cacheKey);

  if (!ignoreCache && cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      ...cached.data,
      city: { ...city }, // keep current city name/metadata
    };
  }

  const forecastUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&timezone=auto` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,visibility` +
    `&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,surface_pressure,wind_speed_10m,visibility,is_day` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max`;

  const airQualityUrl =
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.latitude}&longitude=${city.longitude}&timezone=auto` +
    `&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;

  // Parallel requests: Air Quality can fail gracefully without breaking weather
  const [forecastRes, airQualityRes] = await Promise.all([
    fetchWithTimeout(forecastUrl, signal, 10000),
    fetchWithTimeout(airQualityUrl, signal, 8000).catch(() => null),
  ]);

  if (!forecastRes.ok) {
    throw new Error(`Weather service responded with status ${forecastRes.status}`);
  }

  const forecastData = await forecastRes.json();
  if (!forecastData || !forecastData.current) {
    throw new Error('Received incomplete weather information from service.');
  }

  let airQualityData: AirQualityRaw['current'] | undefined = undefined;
  if (airQualityRes && airQualityRes.ok) {
    try {
      const aqJson = await airQualityRes.json();
      airQualityData = aqJson?.current;
    } catch {
      // Air quality failure ignored gracefully
    }
  }

  const current: CurrentWeatherRaw = forecastData.current;
  const hourly: HourlyWeatherRaw = forecastData.hourly;
  const daily: DailyWeatherRaw = forecastData.daily;

  const result: WeatherData = {
    city,
    current,
    hourly,
    daily,
    airQuality: airQualityData,
    fetchedAt: Date.now(),
  };

  // Cache in memory
  weatherMemoryCache.set(cacheKey, { data: result, timestamp: Date.now() });

  // Also cache last successful response to localStorage for offline recovery
  try {
    localStorage.setItem('skycast_last_cached_weather', JSON.stringify(result));
  } catch {
    // Ignore storage quota errors
  }

  return result;
}

export function getLastCachedWeather(): WeatherData | null {
  try {
    const raw = localStorage.getItem('skycast_last_cached_weather');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
