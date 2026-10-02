import React from 'react';
import { DailyWeatherRaw } from '../types/weather';
import { getWeatherCondition } from '../utils/weatherCodes';
import { getDayOfWeekName, formatDateShort } from '../utils/formatters';
import { WeatherIcon } from './WeatherIcon';
import { CloudRain } from 'lucide-react';

interface DailyListProps {
  daily: DailyWeatherRaw;
  unit: 'celsius' | 'fahrenheit';
}

export const DailyList: React.FC<DailyListProps> = React.memo(({
  daily,
  unit,
}) => {
  const days = (daily.time || []).slice(0, 7);
  const unitSymbol = unit === 'fahrenheit' ? 'F' : 'C';

  return (
    <div className="forecast-list">
      {days.map((timeStr, index) => {
        const isToday = index === 0;
        const dayName = getDayOfWeekName(timeStr, isToday);
        const code = daily.weather_code[index];
        const condition = getWeatherCondition(code, 1);
        const rainProb = daily.precipitation_probability_max?.[index] ?? 0;

        const maxTemp =
          unit === 'fahrenheit'
            ? Math.round((daily.temperature_2m_max[index] * 9) / 5 + 32)
            : Math.round(daily.temperature_2m_max[index]);
        const minTemp =
          unit === 'fahrenheit'
            ? Math.round((daily.temperature_2m_min[index] * 9) / 5 + 32)
            : Math.round(daily.temperature_2m_min[index]);

        return (
          <div
            key={timeStr}
            className={`forecast-row glass-card glass-card-hover ${isToday ? 'today' : ''}`}
          >
            <div className="forecast-day-box">
              <span className="forecast-day-name">{dayName}</span>
              <span className="forecast-day-sub">
                {formatDateShort(timeStr)}
              </span>
            </div>

            <div className="forecast-condition-box">
              <WeatherIcon code={code} isDay={1} size={28} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="forecast-condition-label block font-medium truncate">
                  {condition.label}
                </span>
                {rainProb > 5 && (
                  <span className="text-[11px] text-cyan-400 font-medium flex items-center gap-1 whitespace-nowrap">
                    <CloudRain size={12} className="shrink-0" />
                    {rainProb}% rain
                  </span>
                )}
              </div>
            </div>

            <div className="forecast-temps-box">
              <span className="forecast-max-temp tabular-nums whitespace-nowrap">
                {maxTemp}°<span className="text-[11px] font-normal">{unitSymbol}</span>
              </span>
              <span className="forecast-min-temp tabular-nums whitespace-nowrap">
                {minTemp}°<span className="text-[10px] font-normal">{unitSymbol}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
});
