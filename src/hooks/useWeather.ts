import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchWeatherData, getLastCachedWeather, reverseGeocode } from '../services/weatherApi';
import { CityLocation, WeatherData } from '../types/weather';

export const DEFAULT_CITY: CityLocation = {
  id: 1174872,
  name: 'Karachi',
  country: 'Pakistan',
  country_code: 'PK',
  admin1: 'Sindh',
  latitude: 24.8607,
  longitude: 67.0011,
};

export function useWeather(initialCity?: CityLocation) {
  const [city, setCity] = useState<CityLocation>(() => {
    try {
      const saved = localStorage.getItem('skycast_default_city');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return initialCity || DEFAULT_CITY;
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(() => {
    // If initially offline, attempt to populate with cached data immediately
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return getLastCachedWeather();
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });
  const [isCachedData, setIsCachedData] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadWeather = useCallback(
    async (targetCity: CityLocation, isManualRetry = false) => {
      // Check network status
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setIsOffline(true);
        const cached = getLastCachedWeather();
        if (cached) {
          setWeatherData(cached);
          setIsCachedData(true);
          setError(null);
          setIsLoading(false);
          return;
        } else {
          setError('No internet connection. Please check your network and try again.');
          setIsLoading(false);
          return;
        }
      }

      // Abort any pending fetch
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchWeatherData(targetCity, controller.signal, isManualRetry);
        setWeatherData(data);
        setIsCachedData(false);
        setError(null);
      } catch (err: unknown) {
        // ONLY ignore AbortError from our own cleanup
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        // On failure, check if we have cached data to display as fallback
        const cached = getLastCachedWeather();
        if (cached) {
          setWeatherData(cached);
          setIsCachedData(true);
          setError(null);
        } else {
          const msg =
            err instanceof Error
              ? err.message
              : 'Failed to fetch weather data. Please check your internet connection and try again.';
          setError(msg);
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Trigger load whenever selected city changes
  useEffect(() => {
    loadWeather(city);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [city, loadWeather]);

  // Listen for online and offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Auto-refresh data when back online
      loadWeather(city, true);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [city, loadWeather]);

  const selectCity = useCallback((newCity: CityLocation) => {
    setCity(newCity);
  }, []);

  const selectCoordinates = useCallback(
    async (lat: number, lon: number) => {
      setIsLoading(true);
      try {
        const geocoded = await reverseGeocode(lat, lon);
        setCity(geocoded);
      } catch {
        const fallback: CityLocation = {
          id: Math.round(lat * 1000 + lon),
          name: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
          country: 'Custom Pin',
          latitude: lat,
          longitude: lon,
        };
        setCity(fallback);
      }
    },
    []
  );

  const retry = useCallback(() => {
    loadWeather(city, true);
  }, [city, loadWeather]);

  return {
    city,
    weatherData,
    isLoading,
    error,
    isOffline,
    isCachedData,
    selectCity,
    selectCoordinates,
    retry,
  };
}
