import React from 'react';
import { ChevronLeft, MapPin } from 'lucide-react';
import { ScreenType, WeatherData } from '../types/weather';
import { HourlyList } from '../components/HourlyList';
import { Skeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';
import { formatFullDate } from '../utils/formatters';

interface HourlyProps {
  weatherData: WeatherData | null;
  unit: 'celsius' | 'fahrenheit';
  theme?: 'dark' | 'light';
  isLoading: boolean;
  error: string | null;
  onNavigate: (screen: ScreenType) => void;
  onRetry: () => void;
}

export const Hourly: React.FC<HourlyProps> = ({
  weatherData,
  unit,
  theme = 'dark',
  isLoading,
  error,
  onNavigate,
  onRetry,
}) => {
  return (
    <div className="content-wrapper">
      {/* Top Bar with Back Arrow & Screen Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="search-action-btn"
            onClick={() => onNavigate('home')}
            aria-label="Back to Home"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold text-[var(--text)]">Hourly Forecast</h1>
        </div>

        {weatherData?.city && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-indigo-500 bg-[var(--pill-bg)] py-1.5 px-3 rounded-full border border-[var(--border)]">
              <MapPin size={13} />
              <span className="font-medium text-[var(--text)]">{weatherData.city.name}</span>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-medium hidden sm:inline">
              {formatFullDate(weatherData.current.time)}
            </span>
          </div>
        )}
      </div>

      {error && !weatherData && (
        <ErrorState message={error} onRetry={onRetry} />
      )}

      {isLoading && !weatherData && (
        <div className="space-y-4">
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} width="68px" height="90px" borderRadius="16px" />
            ))}
          </div>
          <Skeleton height="240px" borderRadius="20px" />
        </div>
      )}

      {weatherData && (
        <HourlyList
          data={weatherData}
          unit={unit}
          theme={theme}
        />
      )}
    </div>
  );
};
