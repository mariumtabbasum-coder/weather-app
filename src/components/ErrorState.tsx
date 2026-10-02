import React from 'react';
import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  isOffline?: boolean;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message = 'Failed to fetch weather data. Please check your internet connection and try again.',
  isOffline = false,
  onRetry,
}) => {
  const isNetwork = isOffline || message.toLowerCase().includes('offline') || message.toLowerCase().includes('network') || message.toLowerCase().includes('internet');

  const displayTitle = title || (isNetwork ? 'No internet connection' : 'Oops! Something went wrong');
  const displayDesc = isNetwork
    ? 'Please check your network connection and try again.'
    : message;

  return (
    <div className="state-container glass-card">
      <div className="state-icon-box error">
        {isNetwork ? <WifiOff size={32} /> : <AlertCircle size={32} />}
      </div>
      <h2 className="state-title">{displayTitle}</h2>
      <p className="state-desc">{displayDesc}</p>
      <button type="button" className="btn-primary" onClick={onRetry}>
        <RefreshCw size={15} />
        <span>Try Again</span>
      </button>
    </div>
  );
};
