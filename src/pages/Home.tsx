import React, { useMemo } from 'react';
import { Settings as SettingsIcon, Droplets, Wind, SunMedium, Activity } from 'lucide-react';
import { AppSettings, CityLocation, ScreenType, WeatherData } from '../types/weather';
import { getGreeting, formatHourOnly, formatWindSpeed } from '../utils/formatters';
import { detectWeatherAlert, getAirQualityStatus } from '../utils/weatherCodes';
import { calculateSunPhase } from '../utils/sunTime';
import { SearchBar } from '../components/SearchBar';
import { WeatherCard } from '../components/WeatherCard';
import { QuickForecastStrip } from '../components/QuickForecastStrip';
import { WeatherIcon } from '../components/WeatherIcon';
import { WeatherAlertBanner } from '../components/WeatherAlertBanner';
import { WeatherCardSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

interface HomeProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  settings: AppSettings;
  isCached: boolean;
  onSelectCity: (city: CityLocation) => void;
  onUseLocation: () => void;
  isLoadingLocation: boolean;
  onNavigate: (screen: ScreenType) => void;
  onRetry: () => void;
}

export const Home: React.FC<HomeProps> = ({
  weatherData,
  isLoading,
  error,
  settings,
  isCached,
  onSelectCity,
  onUseLocation,
  isLoadingLocation,
  onNavigate,
  onRetry,
}) => {
  const greeting = useMemo(() => {
    if (!weatherData?.current?.time) return 'Good Day,';
    return getGreeting(weatherData.current.time);
  }, [weatherData?.current?.time]);

  const alertInfo = useMemo(() => {
    if (!settings.alerts || !weatherData?.current) return null;
    return detectWeatherAlert(
      weatherData.current.weather_code,
      weatherData.current.temperature_2m,
      weatherData.current.wind_speed_10m,
      weatherData.daily?.uv_index_max?.[0]
    );
  }, [settings.alerts, weatherData]);

  // Next 12 hours preview strip
  const hourlyPreview = useMemo(() => {
    if (!weatherData?.hourly?.time || !weatherData.current?.time) return [];
    let startIdx = weatherData.hourly.time.findIndex((t) => t >= weatherData.current.time);
    if (startIdx === -1) startIdx = 0;
    const items = [];
    const count = Math.min(12, weatherData.hourly.time.length - startIdx);
    const nowSunPhase = calculateSunPhase(
      weatherData.current.time,
      weatherData.daily,
      weatherData.current.is_day
    );

    for (let i = 0; i < count; i++) {
      const idx = startIdx + i;
      const isNow = i === 0;
      const timeStr = isNow ? weatherData.current.time : weatherData.hourly.time[idx];
      const phase = isNow
        ? nowSunPhase
        : calculateSunPhase(weatherData.hourly.time[idx], weatherData.daily);

      items.push({
        timeStr,
        label: isNow ? 'Now' : formatHourOnly(weatherData.hourly.time[idx]),
        isDay: phase.isDay,
        tempCelsius: isNow
          ? weatherData.current.temperature_2m
          : weatherData.hourly.temperature_2m[idx],
        weatherCode: isNow
          ? weatherData.current.weather_code
          : weatherData.hourly.weather_code[idx],
      });
    }
    return items;
  }, [weatherData]);

  const unitSymbol = settings.unit === 'fahrenheit' ? 'F' : 'C';

  // Highlight metrics
  const uvMax = weatherData?.daily?.uv_index_max?.[0] ? Math.round(weatherData.daily.uv_index_max[0]) : 0;
  const aqiVal = weatherData?.airQuality?.european_aqi ?? weatherData?.airQuality?.us_aqi ?? 20;
  const aqiStatus = getAirQualityStatus(aqiVal);
  const windFormatted = weatherData ? formatWindSpeed(weatherData.current.wind_speed_10m, settings.unit) : '--';

  return (
    <div className="content-wrapper">
      {/* Top Bar Greeting & Settings */}
      <div className="page-header">
        <div>
          <span className="header-greeting">{greeting}</span>
          <h1 className="header-title">
            Let's check the weather <span role="img" aria-label="wave">👋</span>
          </h1>
        </div>

        <button
          type="button"
          className="search-action-btn"
          onClick={() => onNavigate('settings')}
          aria-label="Settings"
          title="Settings"
        >
          <SettingsIcon size={20} />
        </button>
      </div>

      {/* Wide Pill Search Bar */}
      <SearchBar
        onSelectCity={onSelectCity}
        onUseLocation={onUseLocation}
        isLoadingLocation={isLoadingLocation}
      />

      {/* Severe Weather In-App Alert */}
      {alertInfo && <WeatherAlertBanner alert={alertInfo} />}

      {/* Content States: Error, Loading or Main Layout */}
      {error && !weatherData && (
        <ErrorState message={error} onRetry={onRetry} />
      )}

      {isLoading && !weatherData && (
        <WeatherCardSkeleton />
      )}

      {weatherData && (
        <>
          {/* Main Row: Hero Card (approx 60%) + 5-Day Outlook Card (approx 40%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 flex flex-col">
              <WeatherCard
                data={weatherData}
                unit={settings.unit}
                isCached={isCached}
              />
            </div>

            <div className="lg:col-span-5 flex flex-col">
              <QuickForecastStrip
                daily={weatherData.daily}
                unit={settings.unit}
                onViewAllForecast={() => onNavigate('forecast')}
                onViewHourly={() => onNavigate('hourly')}
                onViewDetails={() => onNavigate('details')}
              />
            </div>
          </div>

          {/* Hourly Forecast Preview Strip */}
          <div className="mt-6 mb-2">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold text-[var(--text)]">Today's Hourly Preview</span>
              <button
                type="button"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                onClick={() => onNavigate('hourly')}
              >
                Full 24 Hours →
              </button>
            </div>

            <div className="hourly-strip-scroll">
              {hourlyPreview.map((item, idx) => {
                const tempVal =
                  settings.unit === 'fahrenheit'
                    ? Math.round((item.tempCelsius * 9) / 5 + 32)
                    : Math.round(item.tempCelsius);
                const isNow = idx === 0;

                return (
                  <div
                    key={item.timeStr}
                    className={`hourly-item-card ${isNow ? 'selected' : ''}`}
                    onClick={() => onNavigate('hourly')}
                  >
                    <span className="hourly-time-text">{item.label}</span>
                    <WeatherIcon code={item.weatherCode} isDay={item.isDay} size={28} />
                    <span className="hourly-temp-text tabular-nums">
                      {tempVal}°<span className="text-[10px] font-normal">{unitSymbol}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row of 4 Highlight Cards: Humidity, Wind, UV Index, Air Quality */}
          <div className="home-highlights-grid">
            <div className="highlight-card glass-card">
              <div className="highlight-header">
                <span>Humidity</span>
                <Droplets size={16} className="text-cyan-400" />
              </div>
              <div className="highlight-value tabular-nums">
                {weatherData.current.relative_humidity_2m}%
              </div>
              <div className="highlight-sub">
                {weatherData.current.relative_humidity_2m > 70
                  ? 'High humidity'
                  : weatherData.current.relative_humidity_2m < 35
                  ? 'Dry air'
                  : 'Comfortable moisture'}
              </div>
            </div>

            <div className="highlight-card glass-card">
              <div className="highlight-header">
                <span>Wind Status</span>
                <Wind size={16} className="text-indigo-400" />
              </div>
              <div className="highlight-value tabular-nums">
                {windFormatted}
              </div>
              <div className="highlight-sub">
                Direction: {Math.round(weatherData.current.wind_direction_10m)}°
              </div>
            </div>

            <div className="highlight-card glass-card">
              <div className="highlight-header">
                <span>UV Index</span>
                <SunMedium size={16} className="text-amber-400" />
              </div>
              <div className="highlight-value tabular-nums">
                {uvMax} <span className="text-xs font-normal text-[var(--text-muted)]">/ 11+</span>
              </div>
              <div className="highlight-sub">
                {uvMax <= 2 ? 'Low danger' : uvMax <= 5 ? 'Moderate danger' : uvMax <= 7 ? 'High danger' : 'Very high danger'}
              </div>
            </div>

            <div className="highlight-card glass-card">
              <div className="highlight-header">
                <span>Air Quality</span>
                <Activity size={16} className="text-teal-400" />
              </div>
              <div className="highlight-value flex items-baseline gap-2">
                <span className="tabular-nums">{aqiVal}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${aqiStatus.colorClass}`}>
                  {aqiStatus.label}
                </span>
              </div>
              <div className="highlight-sub truncate">
                {aqiStatus.description}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
