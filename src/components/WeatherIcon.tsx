import React from 'react';
import { getWeatherCondition } from '../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  isDay?: number;
  size?: number;
  className?: string;
  animate?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = React.memo(({
  code,
  isDay = 1,
  size = 36,
  className = '',
  animate = true,
}) => {
  const condition = getWeatherCondition(code, isDay);
  const animClass = animate ? 'weather-icon-animated' : '';

  switch (condition.type) {
    case 'clear':
      if (isDay) {
        // Vibrant glowing Sun with radiating sun rays
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            className={`${className} ${animClass}`}
          >
            <defs>
              <linearGradient id="sunGrad" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE047" />
                <stop offset="0.5" stopColor="#F59E0B" />
                <stop offset="1" stopColor="#EA580C" />
              </linearGradient>
              <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Sun Rays */}
            <g stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" opacity="0.85">
              <line x1="32" y1="8" x2="32" y2="14" />
              <line x1="32" y1="50" x2="32" y2="56" />
              <line x1="8" y1="32" x2="14" y2="32" />
              <line x1="50" y1="32" x2="56" y2="32" />
              <line x1="15" y1="15" x2="19.5" y2="19.5" />
              <line x1="44.5" y1="44.5" x2="49" y2="49" />
              <line x1="15" y1="49" x2="19.5" y2="44.5" />
              <line x1="44.5" y1="19.5" x2="49" y2="15" />
            </g>
            {/* Sun Core */}
            <circle cx="32" cy="32" r="15" fill="url(#sunGrad)" filter="url(#sunGlow)" />
          </svg>
        );
      }
      // Glowing Crescent Moon
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={`${className} ${animClass}`}
        >
          <defs>
            <linearGradient id="moonGrad" x1="20" y1="14" x2="48" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.6" stopColor="#C7D2FE" />
              <stop offset="1" stopColor="#818CF8" />
            </linearGradient>
            <filter id="moonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            d="M44 14C32 15 22 25 22 37C22 49 32 58 44 58C47 58 50 57.5 52 56.5C40 54 33 43 35 31C36.5 22 41 16 44 14Z"
            fill="url(#moonGrad)"
            filter="url(#moonGlow)"
          />
          <circle cx="20" cy="18" r="1.5" fill="#E0E7FF" opacity="0.8" />
          <circle cx="48" cy="22" r="1.2" fill="#E0E7FF" opacity="0.6" />
        </svg>
      );

    case 'partly-cloudy':
      if (isDay) {
        // Sun behind fluffy cloud
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            className={`${className} ${animClass}`}
          >
            <defs>
              <linearGradient id="pcSun" x1="16" y1="12" x2="36" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE047" />
                <stop offset="1" stopColor="#F59E0B" />
              </linearGradient>
              <linearGradient id="cloudGrad" x1="16" y1="26" x2="52" y2="54" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" />
                <stop offset="0.7" stopColor="#E2E8F0" />
                <stop offset="1" stopColor="#94A3B8" />
              </linearGradient>
              <filter id="cloudShadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.25" />
              </filter>
            </defs>
            {/* Sun in background */}
            <circle cx="28" cy="24" r="11" fill="url(#pcSun)" />
            {/* Sun rays */}
            <line x1="28" y1="9" x2="28" y2="6" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="16" x2="13.5" y2="13.5" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="40" y1="16" x2="42.5" y2="13.5" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="12" y1="28" x2="9" y2="28" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            {/* Fore cloud */}
            <path
              d="M22 50H46C51.5 50 56 45.5 56 40C56 34.8 52 30.6 47 30.1C45.8 23.5 40 18.5 33 18.5C25.5 18.5 19.3 24.2 18.5 31.5C14 32.5 10.5 36.5 10.5 41.5C10.5 46.2 14.3 50 19 50H22Z"
              fill="url(#cloudGrad)"
              filter="url(#cloudShadow)"
            />
          </svg>
        );
      }
      // Moon behind cloud
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={`${className} ${animClass}`}
        >
          <defs>
            <linearGradient id="cloudGradNight" x1="16" y1="26" x2="52" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F1F5F9" />
              <stop offset="0.7" stopColor="#CBD5E1" />
              <stop offset="1" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="moonMini" x1="24" y1="14" x2="42" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
          <path
            d="M36 12C28.5 13 22.5 19 22.5 27C22.5 31 24.5 34.5 27.5 37C26 34 26 30 28 26C30 20 34 16 38 14C37.3 12.7 36.7 12.3 36 12Z"
            fill="url(#moonMini)"
          />
          <path
            d="M22 50H46C51.5 50 56 45.5 56 40C56 34.8 52 30.6 47 30.1C45.8 23.5 40 18.5 33 18.5C25.5 18.5 19.3 24.2 18.5 31.5C14 32.5 10.5 36.5 10.5 41.5C10.5 46.2 14.3 50 19 50H22Z"
            fill="url(#cloudGradNight)"
          />
        </svg>
      );

    case 'cloudy':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={`${className} ${animClass}`}
        >
          <defs>
            <linearGradient id="cloudBack" x1="14" y1="18" x2="48" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#CBD5E1" />
              <stop offset="1" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="cloudFore" x1="18" y1="28" x2="54" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.75" stopColor="#E2E8F0" />
              <stop offset="1" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
          {/* Back cloud */}
          <path
            d="M26 40H44C48 40 51 37 51 33C51 29.5 48 26.5 44.5 26.2C43.5 21 39 17 33.5 17C27.5 17 22.5 21.5 22 27.5C18.5 28.5 16 31.5 16 35C16 38.5 19 40 22 40H26Z"
            fill="url(#cloudBack)"
            opacity="0.8"
          />
          {/* Main cloud */}
          <path
            d="M20 52H46C51.5 52 56 47.5 56 42C56 36.8 52 32.6 47 32.1C45.8 25.5 40 20.5 33 20.5C25.5 20.5 19.3 26.2 18.5 33.5C14 34.5 10.5 38.5 10.5 43.5C10.5 48.2 14.3 52 19 52H20Z"
            fill="url(#cloudFore)"
          />
        </svg>
      );

    case 'rain':
    case 'drizzle':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={`${className} ${animClass}`}
        >
          <defs>
            <linearGradient id="rainCloud" x1="18" y1="16" x2="52" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#CBD5E1" />
              <stop offset="0.6" stopColor="#64748B" />
              <stop offset="1" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="dropGrad" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#67E8F9" />
              <stop offset="1" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          <path
            d="M20 42H46C51.5 42 56 37.5 56 32C56 26.8 52 22.6 47 22.1C45.8 15.5 40 10.5 33 10.5C25.5 10.5 19.3 16.2 18.5 23.5C14 24.5 10.5 28.5 10.5 33.5C10.5 38.2 14.3 42 19 42H20Z"
            fill="url(#rainCloud)"
          />
          {/* Rain Drops */}
          <path d="M22 47L19 54" stroke="url(#dropGrad)" strokeWidth="3" strokeLinecap="round" />
          <path d="M33 47L30 55" stroke="url(#dropGrad)" strokeWidth="3" strokeLinecap="round" />
          <path d="M44 47L41 54" stroke="url(#dropGrad)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'thunder':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={`${className} ${animClass}`}
        >
          <defs>
            <linearGradient id="thunderCloud" x1="18" y1="14" x2="52" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#475569" />
              <stop offset="0.6" stopColor="#1E293B" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="boltGrad" x1="30" y1="30" x2="36" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF08A" />
              <stop offset="0.5" stopColor="#FACC15" />
              <stop offset="1" stopColor="#EAB308" />
            </linearGradient>
          </defs>
          <path
            d="M20 38H46C51.5 38 56 33.5 56 28C56 22.8 52 18.6 47 18.1C45.8 11.5 40 6.5 33 6.5C25.5 6.5 19.3 12.2 18.5 19.5C14 20.5 10.5 24.5 10.5 29.5C10.5 34.2 14.3 38 19 38H20Z"
            fill="url(#thunderCloud)"
          />
          {/* Lightning Bolt */}
          <polygon
            points="34,32 26,44 33,44 29,58 41,42 34,42"
            fill="url(#boltGrad)"
            stroke="#FEF08A"
            strokeWidth="0.8"
          />
        </svg>
      );

    case 'snow':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={`${className} ${animClass}`}
        >
          <defs>
            <linearGradient id="snowCloud" x1="18" y1="16" x2="52" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E2E8F0" />
              <stop offset="1" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
          <path
            d="M20 40H46C51.5 40 56 35.5 56 30C56 24.8 52 20.6 47 20.1C45.8 13.5 40 8.5 33 8.5C25.5 8.5 19.3 14.2 18.5 21.5C14 22.5 10.5 26.5 10.5 31.5C10.5 36.2 14.3 40 19 40H20Z"
            fill="url(#snowCloud)"
          />
          {/* Falling Snowflakes */}
          <circle cx="22" cy="48" r="2.5" fill="#FFFFFF" />
          <circle cx="33" cy="53" r="2.5" fill="#FFFFFF" />
          <circle cx="44" cy="48" r="2.5" fill="#FFFFFF" />
        </svg>
      );

    case 'fog':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={`${className} ${animClass}`}
        >
          <defs>
            <linearGradient id="fogLine" x1="0" y1="0" x2="1" y2="0">
              <stop stopColor="#94A3B8" stopOpacity="0.4" />
              <stop offset="0.5" stopColor="#E2E8F0" />
              <stop offset="1" stopColor="#94A3B8" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <rect x="14" y="20" width="36" height="5" rx="2.5" fill="url(#fogLine)" />
          <rect x="10" y="30" width="44" height="5" rx="2.5" fill="url(#fogLine)" />
          <rect x="16" y="40" width="32" height="5" rx="2.5" fill="url(#fogLine)" />
        </svg>
      );

    default:
      return null;
  }
});
