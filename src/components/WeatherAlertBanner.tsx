import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { WeatherAlertInfo } from '../utils/weatherCodes';

interface WeatherAlertBannerProps {
  alert: WeatherAlertInfo;
  onDismiss?: () => void;
}

export const WeatherAlertBanner: React.FC<WeatherAlertBannerProps> = React.memo(({
  alert,
  onDismiss,
}) => {
  return (
    <div className="weather-alert-banner" role="alert">
      <div className="alert-content">
        <div className="alert-icon-box">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h4 className="alert-title">{alert.title}</h4>
          <p className="alert-desc">{alert.description}</p>
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
});
