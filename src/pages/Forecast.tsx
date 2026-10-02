import React, { useMemo } from 'react';
import { ChevronLeft, MapPin, TrendingUp, CloudRain, SunMedium } from 'lucide-react';
import { ScreenType, WeatherData } from '../types/weather';
import { DailyList } from '../components/DailyList';
import { ForecastListSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';
import { getDayOfWeekName, formatFullDate } from '../utils/formatters';

interface ForecastProps {
  weatherData: WeatherData | null;
  unit: 'celsius' | 'fahrenheit';
  isLoading: boolean;
  error: string | null;
  onNavigate: (screen: ScreenType) => void;
  onRetry: () => void;
}

export const Forecast: React.FC<ForecastProps> = ({
  weatherData,
  unit,
  isLoading,
  error,
  onNavigate,
  onRetry,
}) => {
  const daily = weatherData?.daily;
  const unitSymbol = unit === 'fahrenheit' ? 'F' : 'C';

  // Compute temperature trends and highlights
  const { chartPointsHigh, chartPointsLow, warmestDay, rainiestDay } = useMemo(() => {
    if (!daily?.time || daily.time.length === 0) {
      return { chartPointsHigh: '', chartPointsLow: '', warmestDay: null, rainiestDay: null };
    }

    const count = Math.min(7, daily.time.length);
    const highs = daily.temperature_2m_max.slice(0, count);
    const lows = daily.temperature_2m_min.slice(0, count);
    const rains = daily.precipitation_probability_max?.slice(0, count) || [];

    let maxHighVal = -Infinity;
    let maxHighIdx = 0;
    let maxRainVal = 0;
    let maxRainIdx = -1;

    highs.forEach((h, i) => {
      if (h > maxHighVal) {
        maxHighVal = h;
        maxHighIdx = i;
      }
    });

    rains.forEach((r, i) => {
      if (r !== undefined && r !== null && r > maxRainVal) {
        maxRainVal = r;
        maxRainIdx = i;
      }
    });

    const minOfLows = Math.min(...lows);
    const maxOfHighs = Math.max(...highs);
    const range = Math.max(1, maxOfHighs - minOfLows);

    // SVG coordinates: width 340, height 100, padding 15
    const ptsHigh = highs
      .map((val, i) => {
        const x = 20 + i * (300 / (count - 1));
        const y = 90 - ((val - minOfLows) / range) * 70;
        return `${x},${y}`;
      })
      .join(' ');

    const ptsLow = lows
      .map((val, i) => {
        const x = 20 + i * (300 / (count - 1));
        const y = 90 - ((val - minOfLows) / range) * 70;
        return `${x},${y}`;
      })
      .join(' ');

    const warmestConverted =
      unit === 'fahrenheit' ? Math.round((maxHighVal * 9) / 5 + 32) : Math.round(maxHighVal);

    return {
      chartPointsHigh: ptsHigh,
      chartPointsLow: ptsLow,
      warmestDay: {
        name: getDayOfWeekName(daily.time[maxHighIdx], maxHighIdx === 0),
        temp: warmestConverted,
      },
      rainiestDay:
        maxRainIdx !== -1 && maxRainVal > 0
          ? {
              name: getDayOfWeekName(daily.time[maxRainIdx], maxRainIdx === 0),
              chance: `${maxRainVal}% rain`,
            }
          : null,
    };
  }, [daily, unit]);

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
          <h1 className="text-2xl font-bold text-[var(--text)]">7-Day Forecast</h1>
        </div>

        {weatherData?.city && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-[var(--pill-bg)] py-1.5 px-3.5 rounded-full border border-[var(--border)]">
              <MapPin size={13} />
              <span className="font-semibold text-[var(--text)]">{weatherData.city.name}</span>
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
        <ForecastListSkeleton />
      )}

      {weatherData && (
        <div className="forecast-grid-layout">
          {/* Constrained 7-Day List */}
          <div>
            <DailyList daily={weatherData.daily} unit={unit} />
          </div>

          {/* Week at a Glance Card on the Right (Desktop) */}
          <div>
            <div className="glance-card glass-card">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[var(--text)]">Week at a Glance</h3>
                  <TrendingUp size={18} className="text-indigo-400" />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  7-Day temperature range & highs
                </p>
              </div>

              {/* Inline SVG Temperature Trend Chart */}
              <div className="glance-chart-container">
                <svg viewBox="0 0 340 100" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartLineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#818CF8" />
                    </linearGradient>
                  </defs>

                  {/* Highs Trend Line */}
                  <polyline
                    fill="none"
                    stroke="url(#chartLineGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartPointsHigh}
                  />

                  {/* Lows Trend Line */}
                  <polyline
                    fill="none"
                    stroke="#64748B"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    points={chartPointsLow}
                  />
                </svg>

                <div className="flex justify-between text-[11px] text-[var(--text-muted)] px-1 mt-1">
                  <span>Day 1</span>
                  <span className="text-amber-400 font-semibold">— Highs</span>
                  <span className="text-slate-400">--- Lows</span>
                  <span>Day 7</span>
                </div>
              </div>

              {/* Badges: Warmest Day & Rainiest Day */}
              <div className="glance-stats-row">
                {warmestDay && (
                  <div className="glance-stat-box">
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                      <SunMedium size={14} />
                      <span>Warmest Day</span>
                    </div>
                    <span className="text-sm font-bold text-[var(--text)] mt-1">
                      {warmestDay.name} ({warmestDay.temp}°<span className="text-[11px] font-normal">{unitSymbol}</span>)
                    </span>
                  </div>
                )}

                {rainiestDay ? (
                  <div className="glance-stat-box">
                    <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
                      <CloudRain size={14} />
                      <span>Rainiest Day</span>
                    </div>
                    <span className="text-sm font-bold text-[var(--text)] mt-1">
                      {rainiestDay.name} ({rainiestDay.chance})
                    </span>
                  </div>
                ) : (
                  <div className="glance-stat-box">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                      <SunMedium size={14} />
                      <span>Rain Forecast</span>
                    </div>
                    <span className="text-sm font-bold text-[var(--text)] mt-1">
                      No rain expected this week
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
