import React from 'react';
import { MapPin, Droplets, Wind, Thermometer, Clock } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { getWeatherCondition } from '../utils/weatherCodes';
import { formatTime12h, formatWindSpeed, formatFullDate, formatDateShort } from '../utils/formatters';
import { calculateSunPhase } from '../utils/sunTime';
import { WeatherIcon } from './WeatherIcon';
import { WeatherScene } from './WeatherScene';

interface WeatherCardProps {
  data: WeatherData;
  unit: 'celsius' | 'fahrenheit';
  isCached?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = React.memo(({
  data,
  unit,
  isCached = false,
}) => {
  const { city, current, daily } = data;
  const sunPhase = calculateSunPhase(current.time, daily, current.is_day);
  const condition = getWeatherCondition(current.weather_code, sunPhase.isDay);

  const tempVal =
    unit === 'fahrenheit'
      ? Math.round((current.temperature_2m * 9) / 5 + 32)
      : Math.round(current.temperature_2m);

  const feelsLikeVal =
    unit === 'fahrenheit'
      ? Math.round((current.apparent_temperature * 9) / 5 + 32)
      : Math.round(current.apparent_temperature);

  const windFormatted = formatWindSpeed(current.wind_speed_10m, unit);
  const localTimeFormatted = formatTime12h(current.time);
  const localDateFormatted = formatFullDate(current.time);
  const localDateShortFormatted = formatDateShort(current.time);
  const unitSymbol = unit === 'fahrenheit' ? 'F' : 'C';

  const isCountryLocation =
    city.isCountry ||
    (Boolean(city.name) &&
      Boolean(city.country) &&
      city.name.trim().toLowerCase() === city.country.trim().toLowerCase());

  return (
    <div className="weather-hero-card">
      {/* Scenic Vector Illustration Backdrop */}
      <WeatherScene
        weatherCode={current.weather_code}
        isDay={sunPhase.isDay}
        timeStr={current.time}
        sunriseTimeStr={sunPhase.sunriseStr}
        sunsetTimeStr={sunPhase.sunsetStr}
      />

      {/* Dark overlay scrim for high contrast readability */}
      <div className="hero-scrim-overlay" />

      {/* Hero Content Overlay */}
      <div className="hero-card-content">
        {/* Top Location & Local Time Bar */}
        <div className="hero-top-bar">
          <div className="hero-location-info">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-white shrink-0 drop-shadow" />
              <h2 className="hero-city-title">{city.name}</h2>
            </div>
            {!isCountryLocation && (
              <span className="hero-country-sub">
                {city.admin1 && city.admin1 !== city.name && city.admin1 !== city.country ? `${city.admin1}, ` : ''}{city.country}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isCached && (
              <span className="hero-cached-pill">Cached</span>
            )}
            <div className="hero-time-pill">
              <Clock size={12} className="text-white shrink-0" />
              <span className="text-white font-semibold hidden sm:inline">
                {localDateFormatted} · {localTimeFormatted}
              </span>
              <span className="text-white font-semibold inline sm:hidden">
                {localDateShortFormatted} · {localTimeFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Center Row: Big Temp + Condition & Large Colorful Icon */}
        <div className="hero-main-row">
          <div>
            <div className="hero-temp-wrapper">
              <span className="hero-temp-value tabular-nums">{tempVal}°</span>
              <span className="hero-temp-letter">{unitSymbol}</span>
            </div>
            <div className="hero-condition-label">
              {condition.label}
            </div>
          </div>

          <div className="hero-icon-container">
            <WeatherIcon
              code={current.weather_code}
              isDay={sunPhase.isDay}
              size={84}
            />
          </div>
        </div>

        {/* Bottom Translucent Glass Strip: Humidity | Wind | Feels Like */}
        <div className="hero-glass-strip">
          <div className="hero-strip-metric">
            <span className="hero-strip-label">
              <Droplets size={13} className="text-cyan-300 shrink-0" />
              <span className="text-white font-semibold">Humidity</span>
            </span>
            <span className="hero-strip-value tabular-nums">
              {current.relative_humidity_2m}%
            </span>
          </div>

          <div className="hero-strip-divider" />

          <div className="hero-strip-metric">
            <span className="hero-strip-label">
              <Wind size={13} className="text-indigo-200 shrink-0" />
              <span className="text-white font-semibold">Wind</span>
            </span>
            <span className="hero-strip-value tabular-nums">
              {windFormatted}
            </span>
          </div>

          <div className="hero-strip-divider" />

          <div className="hero-strip-metric">
            <span className="hero-strip-label">
              <Thermometer size={13} className="text-amber-300 shrink-0" />
              <span className="text-white font-semibold">Feels Like</span>
            </span>
            <span className="hero-strip-value tabular-nums">
              {feelsLikeVal}°<span className="text-xs">{unitSymbol}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
