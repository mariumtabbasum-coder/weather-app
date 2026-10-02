import React from 'react';
import { AirQualityRaw } from '../types/weather';
import { getAirQualityStatus } from '../utils/weatherCodes';

interface AirQualityCardProps {
  airQuality?: AirQualityRaw['current'];
}

export const AirQualityCard: React.FC<AirQualityCardProps> = React.memo(({
  airQuality,
}) => {
  const aqiValue = airQuality?.european_aqi ?? airQuality?.us_aqi ?? 18;
  const status = getAirQualityStatus(aqiValue);

  return (
    <div className="air-quality-card glass-card">
      <div className="aqi-header">
        <span className="aqi-title">Air Quality</span>
        <span className={`aqi-badge ${status.colorClass}`}>
          {status.label}
        </span>
      </div>

      <div className="aqi-progress-track">
        <div
          className="aqi-progress-pin"
          style={{ left: `${Math.min(98, Math.max(2, status.percentage))}%` }}
        />
      </div>

      <p className="aqi-desc">{status.description}</p>

      {airQuality && (
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[var(--border)] text-center">
          <div>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">PM2.5</span>
            <span className="text-xs font-semibold text-[var(--text)]">
              {airQuality.pm2_5 ? `${Math.round(airQuality.pm2_5)} µg/m³` : '--'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">PM10</span>
            <span className="text-xs font-semibold text-[var(--text)]">
              {airQuality.pm10 ? `${Math.round(airQuality.pm10)} µg/m³` : '--'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Ozone</span>
            <span className="text-xs font-semibold text-[var(--text)]">
              {airQuality.ozone ? `${Math.round(airQuality.ozone)} µg/m³` : '--'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
