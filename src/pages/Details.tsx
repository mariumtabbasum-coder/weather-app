import React from 'react';
import { ChevronLeft, MapPin, Droplets, Wind, Eye, Gauge, Sunrise, Sunset, SunMedium } from 'lucide-react';
import { ScreenType, WeatherData } from '../types/weather';
import { getWeatherCondition } from '../utils/weatherCodes';
import { formatPressure, formatTime12h, formatVisibility, formatWindSpeed, formatFullDate } from '../utils/formatters';
import { WeatherIcon } from '../components/WeatherIcon';
import { DetailCard } from '../components/DetailCard';
import { AirQualityCard } from '../components/AirQualityCard';
import { Skeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

interface DetailsProps {
  weatherData: WeatherData | null;
  unit: 'celsius' | 'fahrenheit';
  isLoading: boolean;
  error: string | null;
  onNavigate: (screen: ScreenType) => void;
  onRetry: () => void;
}

export const Details: React.FC<DetailsProps> = ({
  weatherData,
  unit,
  isLoading,
  error,
  onNavigate,
  onRetry,
}) => {
  if (error && !weatherData) {
    return (
      <div className="content-wrapper">
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isLoading && !weatherData) {
    return (
      <div className="content-wrapper space-y-4">
        <Skeleton height="220px" borderRadius="24px" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton height="100px" />
          <Skeleton height="100px" />
          <Skeleton height="100px" />
          <Skeleton height="100px" />
        </div>
        <Skeleton height="120px" borderRadius="20px" />
      </div>
    );
  }

  if (!weatherData) return null;

  const { city, current, daily, airQuality } = weatherData;
  const condition = getWeatherCondition(current.weather_code, current.is_day);

  const tempVal =
    unit === 'fahrenheit'
      ? Math.round((current.temperature_2m * 9) / 5 + 32)
      : Math.round(current.temperature_2m);
  const feelsLikeVal =
    unit === 'fahrenheit'
      ? Math.round((current.apparent_temperature * 9) / 5 + 32)
      : Math.round(current.apparent_temperature);

  const unitSymbol = unit === 'fahrenheit' ? 'F' : 'C';
  const windFormatted = formatWindSpeed(current.wind_speed_10m, unit);
  const visFormatted = formatVisibility(current.visibility, unit);
  const pressFormatted = formatPressure(current.surface_pressure || current.pressure_msl);

  const sunriseTime = daily.sunrise?.[0] ? formatTime12h(daily.sunrise[0]) : '--:--';
  const sunsetTime = daily.sunset?.[0] ? formatTime12h(daily.sunset[0]) : '--:--';
  const uvMax = daily.uv_index_max?.[0] ? Math.round(daily.uv_index_max[0]) : 0;

  return (
    <div className="content-wrapper">
      {/* Top Bar */}
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
          <h1 className="text-2xl font-bold text-[var(--text)]">Weather Details</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-indigo-500 bg-[var(--pill-bg)] py-1.5 px-3 rounded-full border border-[var(--border)]">
            <MapPin size={13} />
            <span className="font-medium text-[var(--text)]">{city.name}</span>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium hidden sm:inline">
            {formatFullDate(current.time)}
          </span>
        </div>
      </div>

      {/* Large Circular Hero Temperature Badge */}
      <div className="details-circular-hero glass-card">
        <div className="details-hero-circle">
          <WeatherIcon code={current.weather_code} isDay={current.is_day} size={48} />
          <div className="details-hero-temp tabular-nums mt-1">
            {tempVal}°<span className="text-xl font-normal text-slate-300">{unitSymbol}</span>
          </div>
        </div>
        <h2 className="text-lg font-bold text-[var(--text)]">{condition.label}</h2>
        <span className="text-xs text-[var(--text-muted)] mt-1">
          Feels like {feelsLikeVal}°<span className="text-[10px] font-normal">{unitSymbol}</span>
        </span>
      </div>

      {/* 4 Metric Cards */}
      <div className="details-grid">
        <DetailCard
          icon={Droplets}
          title="Humidity"
          value={`${current.relative_humidity_2m}%`}
          subtitle="Relative moisture"
        />

        <DetailCard
          icon={Wind}
          title="Wind"
          value={windFormatted}
          subtitle={`Direction: ${Math.round(current.wind_direction_10m)}°`}
        />

        <DetailCard
          icon={Eye}
          title="Visibility"
          value={visFormatted}
          subtitle="Distance clarity"
        />

        <DetailCard
          icon={Gauge}
          title="Pressure"
          value={pressFormatted}
          subtitle="Atmospheric"
        />
      </div>

      {/* Secondary Grid: Sunrise/Sunset, UV Index, and Air Quality with clean 16px gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Sunrise / Sunset */}
        <div className="glass-card flex items-center justify-around">
          <div className="flex items-center gap-3">
            <Sunrise size={26} className="text-amber-500 shrink-0" />
            <div>
              <span className="text-xs text-[var(--text-muted)] block">Sunrise</span>
              <span className="text-sm font-bold text-[var(--text)] tabular-nums">{sunriseTime}</span>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-[var(--border)]" />
          <div className="flex items-center gap-3">
            <Sunset size={26} className="text-indigo-500 shrink-0" />
            <div>
              <span className="text-xs text-[var(--text-muted)] block">Sunset</span>
              <span className="text-sm font-bold text-[var(--text)] tabular-nums">{sunsetTime}</span>
            </div>
          </div>
        </div>

        {/* UV Index */}
        <div className="glass-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SunMedium size={26} className="text-amber-500 shrink-0" />
            <div>
              <span className="text-xs text-[var(--text-muted)] block">UV Index Max</span>
              <span className="text-base font-bold text-[var(--text)] tabular-nums">{uvMax} / 11+</span>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--pill-bg)] text-[var(--text)] border border-[var(--border)]">
            {uvMax <= 2 ? 'Low' : uvMax <= 5 ? 'Moderate' : uvMax <= 7 ? 'High' : 'Very High'}
          </span>
        </div>
      </div>

      {/* Air Quality Card */}
      <AirQualityCard airQuality={airQuality} />
    </div>
  );
};
