import React, { useMemo, useState, useRef } from 'react';
import { CurrentWeatherRaw, DailyWeatherRaw, HourlyWeatherRaw, WeatherData } from '../types/weather';
import { formatHourOnly, formatPressure, formatVisibility, formatWindSpeed, formatFullDate } from '../utils/formatters';
import { getWeatherCondition } from '../utils/weatherCodes';
import { calculateSunPhase } from '../utils/sunTime';
import { WeatherIcon } from './WeatherIcon';
import { WeatherScene } from './WeatherScene';
import { Droplets, Wind, Eye, Gauge, Thermometer, ChevronLeft, ChevronRight } from 'lucide-react';

interface HourlyListProps {
  data?: WeatherData;
  hourly?: HourlyWeatherRaw;
  current?: CurrentWeatherRaw;
  daily?: DailyWeatherRaw;
  unit: 'celsius' | 'fahrenheit';
  theme?: 'dark' | 'light';
}

export const HourlyList: React.FC<HourlyListProps> = React.memo(({
  data,
  hourly: propHourly,
  current: propCurrent,
  daily: propDaily,
  unit,
  theme = 'dark',
}) => {
  const hourly = propHourly || data?.hourly;
  const current = propCurrent || data?.current;
  const daily = propDaily || data?.daily;
  const isLight = theme === 'light';
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const nowSunPhase = useMemo(() => {
    if (!current) return { isDay: 1, sunriseStr: undefined, sunsetStr: undefined };
    return calculateSunPhase(current.time, daily, current.is_day);
  }, [current, daily]);

  const hourlyEntries = useMemo(() => {
    if (!hourly || !hourly.time || hourly.time.length === 0 || !current) return [];

    let startIndex = hourly.time.findIndex((t: string) => t >= current.time);
    if (startIndex === -1) {
      startIndex = 0;
    }

    const list = [];
    const count = Math.min(24, hourly.time.length - startIndex);

    for (let i = 0; i < count; i++) {
      const idx = startIndex + i;
      const isFirst = i === 0;
      const timeStr = isFirst ? current.time : hourly.time[idx];
      const hourLabel = isFirst ? 'Now' : formatHourOnly(hourly.time[idx]);

      const apiIsDay = isFirst ? current.is_day : (hourly.is_day ? hourly.is_day[idx] : undefined);
      const phase = isFirst ? nowSunPhase : calculateSunPhase(hourly.time[idx], daily, apiIsDay);
      const isDay = phase.isDay;

      list.push({
        index: idx,
        isFirst,
        timeStr,
        hourLabel,
        isDay,
        tempCelsius: isFirst ? current.temperature_2m : hourly.temperature_2m[idx],
        feelsLikeCelsius: isFirst
          ? current.apparent_temperature
          : hourly.apparent_temperature
          ? hourly.apparent_temperature[idx]
          : hourly.temperature_2m[idx],
        weatherCode: isFirst ? current.weather_code : hourly.weather_code[idx],
        humidity: isFirst
          ? current.relative_humidity_2m
          : hourly.relative_humidity_2m
          ? hourly.relative_humidity_2m[idx]
          : current.relative_humidity_2m,
        rainProb: hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0,
        pressure: isFirst
          ? current.surface_pressure
          : hourly.surface_pressure
          ? hourly.surface_pressure[idx]
          : current.surface_pressure,
        windSpeed: isFirst
          ? current.wind_speed_10m
          : hourly.wind_speed_10m
          ? hourly.wind_speed_10m[idx]
          : current.wind_speed_10m,
        visibility: isFirst
          ? current.visibility
          : hourly.visibility
          ? hourly.visibility[idx]
          : current.visibility,
        sunriseStr: phase.sunriseStr,
        sunsetStr: phase.sunsetStr,
      });
    }

    return list;
  }, [hourly, current, daily, nowSunPhase]);

  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const selectedHour = hourlyEntries[selectedIdx] || hourlyEntries[0];

  const unitSymbol = unit === 'fahrenheit' ? 'F' : 'C';

  // Smooth scroll buttons
  const handleScroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftPos.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  if (!selectedHour) {
    return <div className="p-4 text-center text-[var(--text-muted)]">Hourly forecast not available.</div>;
  }

  const selectedCondition = getWeatherCondition(selectedHour.weatherCode, selectedHour.isDay);
  const selectedTemp =
    unit === 'fahrenheit'
      ? Math.round((selectedHour.tempCelsius * 9) / 5 + 32)
      : Math.round(selectedHour.tempCelsius);
  const selectedFeelsLike =
    unit === 'fahrenheit'
      ? Math.round((selectedHour.feelsLikeCelsius * 9) / 5 + 32)
      : Math.round(selectedHour.feelsLikeCelsius);

  const windFormatted = formatWindSpeed(selectedHour.windSpeed, unit);
  const visFormatted = formatVisibility(selectedHour.visibility, unit);
  const pressFormatted = formatPressure(selectedHour.pressure);

  return (
    <div className="w-full">
      {/* Horizontal Strip with Scroll Controls */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-sm font-bold text-[var(--text)]">24-Hour Timeline</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="p-1.5 rounded-lg bg-[var(--pill-bg)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] transition-colors"
              onClick={() => handleScroll(-220)}
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg bg-[var(--pill-bg)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] transition-colors"
              onClick={() => handleScroll(220)}
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Drag-to-scroll container */}
        <div
          ref={scrollRef}
          className="hourly-strip-scroll select-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {hourlyEntries.map((item, idx) => {
            const isSelected = idx === selectedIdx;
            const tempVal =
              unit === 'fahrenheit'
                ? Math.round((item.tempCelsius * 9) / 5 + 32)
                : Math.round(item.tempCelsius);

            return (
              <button
                key={item.timeStr}
                type="button"
                className={`hourly-item-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedIdx(idx)}
              >
                <span className="hourly-time-text">{item.hourLabel}</span>
                <WeatherIcon code={item.weatherCode} isDay={item.isDay} size={30} />
                <span className="hourly-temp-text tabular-nums">
                  {tempVal}°<span className="text-[10px] font-normal">{unitSymbol}</span>
                </span>
                {item.rainProb > 0 && (
                  <span className="text-[10px] text-cyan-400 font-semibold">
                    {item.rainProb}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Large Scenic Hero Card for Selected Hour */}
      <div className="weather-hero-card hourly-scenic-card mb-6">
        <WeatherScene
          weatherCode={selectedHour.weatherCode}
          isDay={selectedHour.isDay}
          timeStr={selectedHour.timeStr}
          sunriseTimeStr={selectedHour.sunriseStr}
          sunsetTimeStr={selectedHour.sunsetStr}
        />
        <div className="hero-scrim-overlay" />

        <div className="hero-card-content">
          <div className="flex items-center justify-between">
            <span
              className="text-xs uppercase font-bold tracking-wider !text-white drop-shadow-sm"
              style={{ color: '#ffffff' }}
            >
              {selectedHour.hourLabel} Outlook
            </span>
            <span
              className="text-xs font-semibold !text-white drop-shadow-sm"
              style={{ color: '#ffffff' }}
            >
              {formatFullDate(selectedHour.timeStr)}
            </span>
          </div>

          <div className="hero-main-row">
            <div>
              <div className="hero-temp-wrapper">
                <span className="hero-temp-value tabular-nums">{selectedTemp}°</span>
                <span className="hero-temp-letter">{unitSymbol}</span>
              </div>
              <div className="hero-condition-label">
                {selectedCondition.label}
              </div>
              <div
                className="flex items-center gap-1.5 mt-2 text-xs font-medium !text-white drop-shadow-sm"
                style={{ color: '#ffffff' }}
              >
                <Thermometer size={14} className="text-amber-400 shrink-0 inline-block" />
                <span
                  className="whitespace-nowrap leading-none !text-white"
                  style={{ color: '#ffffff' }}
                >
                  Feels like {selectedFeelsLike}°{unitSymbol}
                </span>
              </div>
            </div>

            <div className="hero-icon-container">
              <WeatherIcon
                code={selectedHour.weatherCode}
                isDay={selectedHour.isDay}
                size={84}
              />
            </div>
          </div>

          <div className="text-xs text-white/80 italic drop-shadow-sm">
            Condition matches local forecasted weather for {selectedHour.hourLabel}.
          </div>
        </div>
      </div>

      {/* 2x2 Grid on Mobile/Tablet, 4-Grid on Desktop: Humidity, Wind, Visibility, Pressure */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
        <div className="glass-card flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 min-w-0">
          <Droplets size={22} className="text-cyan-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs text-[var(--text-muted)] block whitespace-nowrap">Humidity</span>
            <span className="text-sm sm:text-base font-bold text-[var(--text)] tabular-nums whitespace-nowrap block">
              {selectedHour.humidity}%
            </span>
          </div>
        </div>

        <div className="glass-card flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 min-w-0">
          <Wind size={22} className="text-indigo-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs text-[var(--text-muted)] block whitespace-nowrap">Wind</span>
            <span className="text-sm sm:text-base font-bold text-[var(--text)] tabular-nums whitespace-nowrap block">
              {windFormatted}
            </span>
          </div>
        </div>

        <div className="glass-card flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 min-w-0">
          <Eye size={22} className="text-teal-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs text-[var(--text-muted)] block whitespace-nowrap">Visibility</span>
            <span className="text-sm sm:text-base font-bold text-[var(--text)] tabular-nums whitespace-nowrap block">
              {visFormatted}
            </span>
          </div>
        </div>

        <div className="glass-card flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 min-w-0">
          <Gauge size={22} className="text-amber-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs text-[var(--text-muted)] block whitespace-nowrap">Pressure</span>
            <span className="text-sm sm:text-base font-bold text-[var(--text)] tabular-nums whitespace-nowrap block">
              {pressFormatted}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
