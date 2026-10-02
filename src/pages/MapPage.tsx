import React, { Suspense, lazy } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { CityLocation, ScreenType, WeatherData } from '../types/weather';
import { ErrorState } from '../components/ErrorState';

const WeatherMapLazy = lazy(() => import('../components/WeatherMap'));

interface MapPageProps {
  weatherData: WeatherData | null;
  unit: 'celsius' | 'fahrenheit';
  theme?: 'dark' | 'light';
  isLoading: boolean;
  error: string | null;
  onViewOnHome: (city: CityLocation) => void;
  onSetAsDefault: (city: CityLocation) => void;
  onUseLocation: () => void;
  isLoadingLocation: boolean;
  onNavigate: (screen: ScreenType) => void;
  onRetry: () => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  weatherData,
  unit,
  theme = 'dark',
  isLoading,
  error,
  onViewOnHome,
  onSetAsDefault,
  onUseLocation,
  isLoadingLocation,
  onNavigate,
  onRetry,
}) => {
  return (
    <div className="content-wrapper">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 w-full min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            className="search-action-btn shrink-0"
            onClick={() => onNavigate('home')}
            aria-label="Back to Home"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-xl font-bold text-[var(--text)] truncate">Weather Map</h1>
        </div>

        <span className="text-xs text-[var(--text-muted)] shrink-0 text-right">
          Tap anywhere to inspect
        </span>
      </div>

      {error && !weatherData && (
        <ErrorState message={error} onRetry={onRetry} />
      )}

      {weatherData && (
        <Suspense
          fallback={
            <div className="map-page-container flex flex-col items-center justify-center gap-3 glass-card">
              <Loader2 size={32} className="animate-spin text-indigo-500" />
              <span className="text-sm text-[var(--text-muted)]">Loading interactive map...</span>
            </div>
          }
        >
          <WeatherMapLazy
            weatherData={weatherData}
            unit={unit}
            theme={theme}
            onViewOnHome={onViewOnHome}
            onSetAsDefault={onSetAsDefault}
            onUseLocation={onUseLocation}
            isLoadingLocation={isLoadingLocation}
          />
        </Suspense>
      )}
    </div>
  );
};
