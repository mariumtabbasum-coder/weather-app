import React from 'react';
import { Sun, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="splash-container">
      {/* Decorative Brand Weather Hero Icon */}
      <div className="splash-icon-hero">
        <svg width="96" height="96" viewBox="0 0 64 64" fill="none">
          <circle cx="44" cy="24" r="12" fill="url(#splashSunGrad)" />
          <path
            d="M48 48H18C12.4772 48 8 43.5228 8 38C8 32.7844 11.9961 28.5029 17.1086 28.0494C18.6657 20.0899 25.6881 14 34.125 14C43.5186 14 51.2721 21.1444 52.1747 30.3475C56.6277 31.6025 60 35.6563 60 40.5C60 45.7467 55.7467 50 50.5 50"
            stroke="url(#splashCloudGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="splashSunGrad" x1="32" y1="12" x2="56" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#EF4444" />
            </linearGradient>
            <linearGradient id="splashCloudGrad" x1="8" y1="14" x2="60" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818CF8" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <h1 className="splash-title">SkyCast</h1>
      <h2 className="splash-tagline">Your Weather, Your Day</h2>
      <p className="splash-desc">
        Accurate forecasts, beautiful insights. All in one place.
      </p>

      {/* 3 Key Feature Icons */}
      <div className="splash-features">
        <div className="splash-feature-item">
          <div className="splash-feature-icon">
            <Sun size={20} />
          </div>
          <span className="splash-feature-label">Real-time Weather</span>
        </div>

        <div className="splash-feature-item">
          <div className="splash-feature-icon">
            <Calendar size={20} />
          </div>
          <span className="splash-feature-label">7-Day Forecast</span>
        </div>

        <div className="splash-feature-item">
          <div className="splash-feature-icon">
            <MapPin size={20} />
          </div>
          <span className="splash-feature-label">Location Search</span>
        </div>
      </div>

      {/* Get Started CTA */}
      <button
        type="button"
        className="btn-primary w-full max-w-[280px]"
        onClick={onGetStarted}
      >
        <span>Get Started</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
};
