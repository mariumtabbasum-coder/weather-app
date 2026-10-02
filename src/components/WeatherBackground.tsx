import React, { useEffect, useMemo, useState } from 'react';
import { getWeatherCondition } from '../utils/weatherCodes';
import { useTimeOfDay } from '../utils/timeOfDay';

interface WeatherBackgroundProps {
  weatherCode?: number;
  isDay?: number;
  timeStr?: string;
  isLoading?: boolean;
  theme?: 'dark' | 'light';
}

const STARS_DATA = Array.from({ length: 35 }).map((_, i) => ({
  id: i,
  top: `${(i * 19) % 65}%`,
  left: `${(i * 31) % 96}%`,
  size: (i % 3) + 1.5,
  delay: `${(i * 0.25) % 3}s`,
  duration: `${2 + (i % 3)}s`,
}));

const RAIN_DROPS = Array.from({ length: 25 }).map((_, i) => ({
  id: i,
  left: `${i * 4 + 1}%`,
  delay: `${(i * 0.08) % 0.8}s`,
  duration: `${0.65 + (i % 4) * 0.1}s`,
  height: 18 + (i % 12),
  opacity: 0.4 + (i % 5) * 0.1,
}));

const SNOW_FLAKES = Array.from({ length: 25 }).map((_, i) => ({
  id: i,
  left: `${i * 4 + 2}%`,
  delay: `${(i * 0.2) % 3}s`,
  duration: `${3.5 + (i % 3) * 0.8}s`,
  size: 3 + (i % 4),
}));

export const WeatherBackground: React.FC<WeatherBackgroundProps> = React.memo(({
  weatherCode = 0,
  isDay = 1,
  timeStr,
  isLoading = false,
  theme = 'dark',
}) => {
  const [isTabVisible, setIsTabVisible] = useState(true);
  const timeOfDay = useTimeOfDay(timeStr);

  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const condition = useMemo(() => {
    return getWeatherCondition(weatherCode, isDay);
  }, [weatherCode, isDay]);

  const skyBackgroundStyle = useMemo(() => {
    if (theme === 'light') {
      if (timeOfDay === 'morning') {
        if (condition.type === 'clear') {
          return {
            background: 'linear-gradient(180deg, #BAE6FD 0%, #E0F2FE 40%, #FEF3C7 85%, #FDE68A 100%)',
          };
        }
        if (condition.type === 'rain' || condition.type === 'thunder') {
          return {
            background: 'linear-gradient(180deg, #CBD5E1 0%, #E2E8F0 45%, #FEF3C7 100%)',
          };
        }
        return {
          background: 'linear-gradient(180deg, #DCEAFE 0%, #E8F0FE 45%, #FEF3C7 100%)',
        };
      } else if (timeOfDay === 'day') {
        if (condition.type === 'clear') {
          return {
            background: 'linear-gradient(180deg, #BAE6FD 0%, #E0F2FE 40%, #EEF2FF 100%)',
          };
        }
        if (condition.type === 'rain' || condition.type === 'thunder') {
          return {
            background: 'linear-gradient(180deg, #CBD5E1 0%, #E2E8F0 45%, #EEF2FF 100%)',
          };
        }
        return {
          background: 'linear-gradient(180deg, #DCEAFE 0%, #E8F0FE 45%, #EEF2FF 100%)',
        };
      } else if (timeOfDay === 'evening') {
        return {
          background: 'linear-gradient(180deg, #FDE68A 0%, #FED7AA 35%, #FBCFE8 70%, #DDD6FE 100%)',
        };
      } else {
        // Light theme at night: soft lavender dusk with NO dark navy
        return {
          background: 'linear-gradient(180deg, #DDD6FE 0%, #EDE9FE 50%, #EEF2FF 100%)',
        };
      }
    } else {
      // Dark Theme
      if (timeOfDay === 'morning') {
        if (condition.type === 'clear') {
          return {
            background: 'radial-gradient(circle at 75% 15%, #1e3a8a 0%, #1e293b 40%, #0f172a 75%, #080d1a 100%)',
          };
        }
        if (condition.type === 'rain' || condition.type === 'thunder') {
          return {
            background: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 70%, #060910 100%)',
          };
        }
        return {
          background: 'radial-gradient(circle at 60% 10%, #1e3a8a 0%, #0f172a 65%, #0b1120 100%)',
        };
      } else if (timeOfDay === 'day') {
        if (condition.type === 'clear') {
          return {
            background: 'radial-gradient(circle at 75% 15%, #1d4ed8 0%, #1e3a8a 35%, #0f172a 70%, #080d1a 100%)',
          };
        }
        if (condition.type === 'rain' || condition.type === 'thunder') {
          return {
            background: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 70%, #060910 100%)',
          };
        }
        return {
          background: 'radial-gradient(circle at 60% 10%, #1e293b 0%, #0f172a 65%, #0b1120 100%)',
        };
      } else if (timeOfDay === 'evening') {
        return {
          background: 'radial-gradient(circle at 75% 30%, #3b0764 0%, #581c87 30%, #1e1b4b 65%, #0b0f19 100%)',
        };
      } else {
        // Dark Night
        if (condition.type === 'clear') {
          return {
            background: 'radial-gradient(circle at 80% 20%, #1e1b4b 0%, #0f172a 60%, #050811 100%)',
          };
        }
        return {
          background: 'radial-gradient(circle at 50% 0%, #111827 0%, #0b0f19 70%, #03050a 100%)',
        };
      }
    }
  }, [condition.type, timeOfDay, theme]);

  const shouldAnimate = !isLoading && isTabVisible;
  // In dark theme, show stars during night period only
  const showStars = theme === 'dark' && timeOfDay === 'night' && shouldAnimate;

  return (
    <div className="dynamic-weather-bg" style={skyBackgroundStyle}>
      {/* Stars on dark night only (no page-level moon or sun) */}
      {showStars && (
        <div className="bg-stars-container">
          {STARS_DATA.map((star) => (
            <div
              key={star.id}
              className="star-point"
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: star.delay,
                animationDuration: star.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* Drifting Clouds */}
      {(condition.type === 'cloudy' || condition.type === 'partly-cloudy') && shouldAnimate && (
        <>
          <div
            className="cloud-drifter"
            style={{
              top: '12%',
              width: '280px',
              height: '140px',
              background:
                theme === 'light'
                  ? 'radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 70%)'
                  : 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
              animationDuration: '48s',
              animationDelay: '0s',
            }}
          />
          <div
            className="cloud-drifter"
            style={{
              top: '25%',
              width: '380px',
              height: '180px',
              background:
                theme === 'light'
                  ? 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)'
                  : 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
              animationDuration: '56s',
              animationDelay: '-22s',
            }}
          />
        </>
      )}

      {/* Rain / Drizzle */}
      {(condition.type === 'rain' || condition.type === 'drizzle' || condition.type === 'thunder') &&
        shouldAnimate && (
          <>
            {RAIN_DROPS.map((drop) => (
              <div
                key={drop.id}
                className="rain-drop"
                style={{
                  left: drop.left,
                  height: `${drop.height}px`,
                  opacity: drop.opacity,
                  animationDelay: drop.delay,
                  animationDuration: drop.duration,
                }}
              />
            ))}
          </>
        )}

      {/* Lightning Flash in Dark Theme */}
      {condition.type === 'thunder' && shouldAnimate && <div className="lightning-flash" />}

      {/* Snow */}
      {condition.type === 'snow' && shouldAnimate && (
        <>
          {SNOW_FLAKES.map((flake) => (
            <div
              key={flake.id}
              className="snow-flake"
              style={{
                left: flake.left,
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                animationDelay: flake.delay,
                animationDuration: flake.duration,
              }}
            />
          ))}
        </>
      )}

      {/* Layered Mountain Silhouette at Bottom styled via CSS variables */}
      <svg
        className="mountain-vector-bottom"
        viewBox="0 0 1440 240"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 240L0 130C160 100 280 140 440 105C620 65 740 120 900 85C1080 45 1220 95 1440 60L1440 240Z"
          fill="var(--mountain-back)"
          fillOpacity={theme === 'light' ? '0.35' : '0.55'}
        />
        <path
          d="M0 240L0 160C190 125 330 180 500 135C680 90 820 160 1020 115C1180 80 1320 130 1440 100L1440 240Z"
          fill="var(--mountain-mid)"
          fillOpacity={theme === 'light' ? '0.5' : '0.75'}
        />
        <path
          d="M0 240L0 190C150 160 300 200 480 165C660 130 840 195 1060 155C1240 125 1360 170 1440 145L1440 240Z"
          fill="var(--mountain-fore)"
          fillOpacity={theme === 'light' ? '0.65' : '1'}
        />
      </svg>
    </div>
  );
});
