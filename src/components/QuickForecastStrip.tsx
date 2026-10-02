import React from 'react';
import { DailyWeatherRaw } from '../types/weather';
import { getDayOfWeekName } from '../utils/formatters';
import { getWeatherCondition } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import { Clock, Compass, ArrowRight } from 'lucide-react';

interface QuickForecastStripProps {
  daily: DailyWeatherRaw;
  unit: 'celsius' | 'fahrenheit';
  onViewAllForecast: () => void;
  onViewHourly: () => void;
  onViewDetails: () => void;
}

export const QuickForecastStrip: React.FC<QuickForecastStripProps> = React.memo(({
  daily,
  unit,
  onViewAllForecast,
  onViewHourly,
  onViewDetails,
}) => {
  const days = (daily.time || []).slice(0, 5);
  const unitSymbol = unit === 'fahrenheit' ? 'F' : 'C';

  return (
    <div className="home-outlook-card glass-card">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base font-bold text-[var(--text)]">5-Day Outlook</h3>
        <button
          type="button"
          onClick={onViewAllForecast}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          <span>View 7 Days</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 5 Day Rows (Responsive: vertical on desktop, horizontal on mobile) */}
      <div className="outlook-days-list">
        {days.map((timeStr, index) => {
          const isToday = index === 0;
          const dayName = getDayOfWeekName(timeStr, isToday);
          const code = daily.weather_code[index];
          const condition = getWeatherCondition(code, 1);
          const maxTemp =
            unit === 'fahrenheit'
              ? Math.round((daily.temperature_2m_max[index] * 9) / 5 + 32)
              : Math.round(daily.temperature_2m_max[index]);
          const minTemp =
            unit === 'fahrenheit'
              ? Math.round((daily.temperature_2m_min[index] * 9) / 5 + 32)
              : Math.round(daily.temperature_2m_min[index]);

          return (
            <div key={timeStr} className="outlook-day-row">
              <span className="outlook-day-label">{dayName}</span>

              <div className="outlook-day-center">
                <WeatherIcon code={code} isDay={1} size={28} />
                <span className="outlook-day-condition hidden sm:inline">
                  {condition.label}
                </span>
              </div>

              <div className="outlook-day-temps">
                <span className="outlook-temp-max tabular-nums">
                  {maxTemp}°<span className="text-[11px] font-normal">{unitSymbol}</span>
                </span>
                <span className="outlook-temp-min tabular-nums">
                  {minTemp}°<span className="text-[10px] font-normal">{unitSymbol}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons Inside the Card at Bottom */}
      <div className="outlook-card-actions">
        <button
          type="button"
          className="outlook-action-btn flex-1"
          onClick={onViewHourly}
        >
          <Clock size={15} className="text-indigo-400" />
          <span>Hourly Breakdown</span>
        </button>

        <button
          type="button"
          className="outlook-action-btn flex-1"
          onClick={onViewDetails}
        >
          <Compass size={15} className="text-teal-400" />
          <span>Weather Details</span>
        </button>
      </div>
    </div>
  );
});
