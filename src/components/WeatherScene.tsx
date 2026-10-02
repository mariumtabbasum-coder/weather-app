import React, { useMemo } from 'react';
import { parseIsoMinutes } from '../utils/sunTime';
import { getTimeOfDayTheme, TimeOfDayPeriod } from '../utils/timeOfDay';

interface WeatherSceneProps {
  weatherCode: number;
  isDay: number;
  timeStr?: string;
  sunriseTimeStr?: string;
  sunsetTimeStr?: string;
  className?: string;
}

type SceneMode =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'
  | 'sunset-sunrise'
  | 'cloudy'
  | 'rain'
  | 'thunder'
  | 'snow'
  | 'fog';

function checkIsSunriseSunset(timeStr?: string, sunriseTimeStr?: string, sunsetTimeStr?: string): boolean {
  if (!timeStr) return false;

  const currentMins = parseIsoMinutes(timeStr);
  if (currentMins !== null) {
    if (sunriseTimeStr) {
      const srMins = parseIsoMinutes(sunriseTimeStr);
      // Dawn window: 15 mins before to 10 mins after actual sunrise
      if (srMins !== null && currentMins >= srMins - 15 && currentMins <= srMins + 10) {
        return true;
      }
    }
    if (sunsetTimeStr) {
      const ssMins = parseIsoMinutes(sunsetTimeStr);
      // Dusk window: 10 mins before to 25 mins after actual sunset
      if (ssMins !== null && currentMins >= ssMins - 10 && currentMins <= ssMins + 25) {
        return true;
      }
    }
  }

  return false;
}

const STARS = [
  { cx: 50, cy: 35, r: 1.5, delay: '0s' },
  { cx: 95, cy: 55, r: 1.2, delay: '0.6s' },
  { cx: 140, cy: 25, r: 1.8, delay: '1.2s' },
  { cx: 185, cy: 65, r: 1.3, delay: '1.8s' },
  { cx: 230, cy: 40, r: 1.5, delay: '0.4s' },
  { cx: 275, cy: 20, r: 2.0, delay: '1.5s' },
  { cx: 310, cy: 75, r: 1.2, delay: '2.1s' },
  { cx: 350, cy: 30, r: 1.6, delay: '0.9s' },
  { cx: 440, cy: 45, r: 1.4, delay: '1.7s' },
  { cx: 475, cy: 80, r: 1.2, delay: '0.3s' },
  { cx: 70, cy: 80, r: 1.4, delay: '1.4s' },
  { cx: 120, cy: 95, r: 1.0, delay: '2.3s' },
  { cx: 165, cy: 45, r: 1.7, delay: '0.8s' },
  { cx: 210, cy: 85, r: 1.3, delay: '1.9s' },
  { cx: 260, cy: 60, r: 1.5, delay: '0.5s' },
  { cx: 420, cy: 90, r: 1.1, delay: '1.1s' },
];

const RAIN_DROPS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: (i * 21) % 480 + 10,
  y: ((i * 17) % 110) + 15,
  delay: `${((i * 0.13) % 1.1).toFixed(2)}s`,
  duration: `${0.85 + ((i % 4) * 0.08)}s`,
}));

const SNOWFLAKES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: (i * 25) % 480 + 10,
  y: ((i * 19) % 80) + 10,
  r: 2 + (i % 3) * 0.8,
  delay: `${((i * 0.29) % 4).toFixed(2)}s`,
  duration: `${4.5 + ((i % 3) * 1.2)}s`,
}));

const SUN_RAY_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export const WeatherScene: React.FC<WeatherSceneProps> = React.memo(({
  weatherCode,
  isDay,
  timeStr,
  sunriseTimeStr,
  sunsetTimeStr,
  className = '',
}) => {
  const timeTheme = useMemo(() => {
    return getTimeOfDayTheme(timeStr);
  }, [timeStr]);

  const mode: SceneMode = useMemo(() => {
    // Thunderstorm
    if (weatherCode >= 95) return 'thunder';

    // Rain / Drizzle
    if (
      (weatherCode >= 51 && weatherCode <= 57) ||
      (weatherCode >= 61 && weatherCode <= 67) ||
      (weatherCode >= 80 && weatherCode <= 82)
    ) {
      return 'rain';
    }

    // Snow
    if (
      (weatherCode >= 71 && weatherCode <= 77) ||
      (weatherCode >= 85 && weatherCode <= 86)
    ) {
      return 'snow';
    }

    // Fog / Haze
    if (weatherCode === 45 || weatherCode === 48) {
      return 'fog';
    }

    // Sunrise / Sunset window (when not stormy)
    if (checkIsSunriseSunset(timeStr, sunriseTimeStr, sunsetTimeStr)) {
      return 'sunset-sunrise';
    }

    // Overcast / Cloudy
    if (weatherCode === 3) {
      return 'cloudy';
    }

    // Dynamic Time-of-Day states for clear & partly cloudy:
    // 1. Morning (6:00 AM to 11:59 AM)
    // 2. Afternoon (12:00 PM to 4:59 PM)
    // 3. Evening (5:00 PM to 6:59 PM)
    // 4. Night (7:00 PM to 5:59 AM)
    return timeTheme.period;
  }, [weatherCode, timeStr, sunriseTimeStr, sunsetTimeStr, timeTheme.period]);

  // Dynamic sky gradients with 600ms cross-fade in CSS
  const skyGradient = useMemo(() => {
    switch (mode) {
      case 'morning':
        return 'linear-gradient(180deg, #0284C7 0%, #38BDF8 35%, #FDE047 75%, #FB923C 100%)';
      case 'afternoon':
        return 'linear-gradient(180deg, #0284C7 0%, #0EA5E9 35%, #38BDF8 70%, #818CF8 100%)';
      case 'evening':
      case 'sunset-sunrise':
        return 'linear-gradient(180deg, #3B0764 0%, #701A75 25%, #BE185D 50%, #EA580C 75%, #F59E0B 100%)';
      case 'night':
        return 'linear-gradient(180deg, #050714 0%, #0B1120 35%, #1E1B4B 70%, #2E1065 100%)';
      case 'cloudy':
        return isDay
          ? 'linear-gradient(180deg, #334155 0%, #475569 45%, #64748B 80%, #94A3B8 100%)'
          : 'linear-gradient(180deg, #0B1120 0%, #1E293B 45%, #334155 80%, #475569 100%)';
      case 'rain':
        return 'linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #334155 85%, #475569 100%)';
      case 'thunder':
        return 'linear-gradient(180deg, #020617 0%, #0B1120 45%, #1E1B4B 75%, #18181B 100%)';
      case 'snow':
        return 'linear-gradient(180deg, #334155 0%, #64748B 40%, #94A3B8 75%, #CBD5E1 100%)';
      case 'fog':
        return 'linear-gradient(180deg, #475569 0%, #64748B 45%, #94A3B8 80%, #CBD5E1 100%)';
      default:
        return 'linear-gradient(180deg, #0284C7 0%, #38BDF8 50%, #818CF8 100%)';
    }
  }, [mode, isDay]);

  return (
    <div
      className={`weather-scene-container ${className}`}
      style={{ background: skyGradient }}
    >
      {/* Thunderstorm lightning opacity flash overlay */}
      {mode === 'thunder' && <div className="scene-lightning-overlay" />}

      {/* Main Vector SVG Scenery */}
      <svg
        className="weather-scene-svg"
        viewBox="0 0 500 320"
        fill="none"
        preserveAspectRatio="xMidYMin slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Day Sun Gradient */}
          <linearGradient id="sceneSunGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0.7" />
          </linearGradient>

          {/* Sunset Sun Gradient */}
          <linearGradient id="sunsetSunGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#F97316" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0.75" />
          </linearGradient>

          {/* Moon Gradient */}
          <linearGradient id="sceneMoonGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.8" />
          </linearGradient>

          {/* Cloud Gradients */}
          <linearGradient id="softCloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="darkCloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1E293B" stopOpacity="0.9" />
          </linearGradient>

          {/* Fog Gradient */}
          <linearGradient id="fogGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.1" />
          </linearGradient>

          {/* Monument Shading */}
          <linearGradient id="monumentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#CBD5E1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.9" />
          </linearGradient>

          {/* Mountain gradients */}
          <linearGradient id="mountainBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="mountainMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#312E81" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="mountainFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0B1120" stopOpacity="1" />
          </linearGradient>

          {/* Shooting Star Gradients */}
          <linearGradient id="shootingStarGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="35%" stopColor="#A5B4FC" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="shootingStarGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
          </linearGradient>

          {/* Soft Ethereal Atmospheric Wisps */}
          <linearGradient id="nightWispGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0" />
            <stop offset="30%" stopColor="#818CF8" stopOpacity="0.14" />
            <stop offset="65%" stopColor="#C7D2FE" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="dayWispGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="75%" stopColor="#E0F2FE" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ========================================================
            Celestial Bodies & Live Dynamic Motion
            ======================================================== */}

        {/* 1. Morning (6:00 AM to 11:59 AM): Rising Sun, Rotating Rays & Soft Drifting Wisps */}
        {mode === 'morning' && (
          <g>
            {/* Drifting Morning Wisps */}
            <g className="scene-cloud-drift-slow-1">
              <ellipse cx="120" cy="55" rx="130" ry="20" fill="url(#dayWispGrad)" />
            </g>
            <g className="scene-cloud-drift-slow-2">
              <ellipse cx="320" cy="75" rx="140" ry="24" fill="url(#dayWispGrad)" />
            </g>

            {/* Pulsing Sun Aura */}
            <circle cx="390" cy="155" r="85" fill="#FEF08A" className="scene-sun-pulse-aura" />
            <circle cx="390" cy="155" r="130" fill="#F59E0B" opacity="0.10" />

            {/* Slowly Rotating Sun Rays */}
            <g className="scene-sun-rays-morning">
              {SUN_RAY_ANGLES.map((angle) => (
                <line
                  key={angle}
                  x1={390 + 58 * Math.cos((angle * Math.PI) / 180)}
                  y1={155 + 58 * Math.sin((angle * Math.PI) / 180)}
                  x2={390 + 76 * Math.cos((angle * Math.PI) / 180)}
                  y2={155 + 76 * Math.sin((angle * Math.PI) / 180)}
                  stroke="#FEF08A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              ))}
            </g>

            {/* Sun Core */}
            <circle cx="390" cy="155" r="50" fill="url(#sceneSunGrad)" />
          </g>
        )}

        {/* 2. Afternoon (12:00 PM to 4:59 PM): High Zenith Sun, Rotating Rays & Daylight Wisps */}
        {mode === 'afternoon' && (
          <g>
            {/* Drifting Daytime Wisps */}
            <g className="scene-cloud-drift-slow-1">
              <ellipse cx="140" cy="50" rx="135" ry="22" fill="url(#dayWispGrad)" />
            </g>
            <g className="scene-cloud-drift-slow-2">
              <ellipse cx="340" cy="70" rx="145" ry="26" fill="url(#dayWispGrad)" />
            </g>

            {/* Pulsing Daylight Sun Aura */}
            <circle cx="390" cy="90" r="80" fill="#FEF08A" className="scene-sun-pulse-aura" />
            <circle cx="390" cy="90" r="125" fill="#38BDF8" opacity="0.15" />

            {/* Rotating Daylight Sun Rays */}
            <g className="scene-sun-rays-afternoon">
              {SUN_RAY_ANGLES.map((angle) => (
                <line
                  key={angle}
                  x1={390 + 54 * Math.cos((angle * Math.PI) / 180)}
                  y1={90 + 54 * Math.sin((angle * Math.PI) / 180)}
                  x2={390 + 76 * Math.cos((angle * Math.PI) / 180)}
                  y2={90 + 76 * Math.sin((angle * Math.PI) / 180)}
                  stroke="#FEF08A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              ))}
            </g>

            {/* Sun Core */}
            <circle cx="390" cy="90" r="46" fill="url(#sceneSunGrad)" />
          </g>
        )}

        {/* 3. Evening (5:00 PM to 6:59 PM): Warm Sunset & Breathing Horizon Sky Glow */}
        {(mode === 'evening' || mode === 'sunset-sunrise') && (
          <g>
            {/* Drifting Sunset Wisps */}
            <g className="scene-cloud-drift-slow-1">
              <ellipse cx="150" cy="65" rx="140" ry="24" fill="url(#dayWispGrad)" opacity="0.6" />
            </g>

            {/* Breathing Horizon Glow */}
            <circle cx="385" cy="175" r="95" fill="#F59E0B" className="scene-sunset-pulse-aura" />
            <circle cx="385" cy="175" r="145" fill="#BE185D" opacity="0.16" />

            {/* Setting Sun Core */}
            <circle cx="385" cy="175" r="54" fill="url(#sunsetSunGrad)" />
          </g>
        )}

        {/* 4. Night (7:00 PM to 5:59 AM): Drifting Wisps, Twinkling Stars, Pulsing Moon & Shooting Stars! */}
        {mode === 'night' && (
          <g>
            {/* Constantly Drifting Soft Cosmic Wisps across the sky */}
            <g className="scene-cloud-drift-slow-1">
              <ellipse cx="130" cy="55" rx="140" ry="24" fill="url(#nightWispGrad)" />
            </g>
            <g className="scene-cloud-drift-slow-2">
              <ellipse cx="360" cy="78" rx="160" ry="28" fill="url(#nightWispGrad)" />
            </g>

            {/* Twinkling & Floating Night Stars */}
            {STARS.map((s, idx) => {
              const starAnimClass = `scene-star-${(idx % 3) + 1}`;
              return (
                <circle
                  key={idx}
                  cx={s.cx}
                  cy={s.cy}
                  r={s.r}
                  fill="#FFFFFF"
                  className={`scene-star ${starAnimClass}`}
                  style={{ animationDelay: s.delay }}
                />
              );
            })}

            {/* Dynamic Shooting Star 1: Streaks diagonally across the sky every 6s */}
            <g className="scene-shooting-star-1">
              <line
                x1="0"
                y1="0"
                x2="-52"
                y2="-30"
                stroke="url(#shootingStarGrad1)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="0" cy="0" r="2.2" fill="#FFFFFF" />
            </g>

            {/* Dynamic Shooting Star 2: Staggered secondary meteor */}
            <g className="scene-shooting-star-2">
              <line
                x1="0"
                y1="0"
                x2="-40"
                y2="-22"
                stroke="url(#shootingStarGrad2)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
            </g>

            {/* Breathing Moon Ambient Glow Aura */}
            <circle cx="390" cy="85" r="48" fill="#C7D2FE" className="scene-moon-pulse-aura" />

            {/* Moon Body */}
            <circle cx="390" cy="85" r="32" fill="url(#sceneMoonGrad)" />
            <circle cx="390" cy="85" r="36" fill="#C7D2FE" opacity="0.25" />
          </g>
        )}

        {/* ========================================================
            Clouds Layer
            ======================================================== */}

        {/* Partly Cloudy (Weather code 2): 1-2 soft drifting clouds */}
        {weatherCode === 2 && (
          <g>
            {/* Cloud 1 */}
            <g className="scene-cloud scene-cloud-drift-1">
              <path
                d="M40 80 a18 18 0 0 1 30 -8 a26 26 0 0 1 48 4 a16 16 0 0 1 22 14 a12 12 0 0 1 -12 12 h-76 a14 14 0 0 1 -12 -22 z"
                fill="url(#softCloudGrad)"
              />
            </g>
            {/* Cloud 2 */}
            <g className="scene-cloud scene-cloud-drift-2">
              <path
                d="M190 50 a14 14 0 0 1 24 -6 a20 20 0 0 1 38 3 a14 14 0 0 1 18 12 a10 10 0 0 1 -10 10 h-60 a12 12 0 0 1 -10 -19 z"
                fill="url(#softCloudGrad)"
                opacity="0.8"
              />
            </g>
          </g>
        )}

        {/* Cloudy / Overcast: 3-4 soft clouds drifting across */}
        {mode === 'cloudy' && (
          <g>
            <g className="scene-cloud scene-cloud-drift-1">
              <path
                d="M10 60 a22 22 0 0 1 36 -10 a32 32 0 0 1 58 5 a20 20 0 0 1 28 17 a16 16 0 0 1 -16 16 h-92 a18 18 0 0 1 -14 -28 z"
                fill="url(#softCloudGrad)"
              />
            </g>
            <g className="scene-cloud scene-cloud-drift-2">
              <path
                d="M160 40 a18 18 0 0 1 30 -8 a26 26 0 0 1 48 4 a16 16 0 0 1 22 14 a12 12 0 0 1 -12 12 h-76 a14 14 0 0 1 -12 -22 z"
                fill="url(#softCloudGrad)"
                opacity="0.85"
              />
            </g>
            <g className="scene-cloud scene-cloud-drift-3">
              <path
                d="M320 85 a20 20 0 0 1 32 -8 a28 28 0 0 1 52 4 a18 18 0 0 1 24 15 a14 14 0 0 1 -14 13 h-80 a16 16 0 0 1 -14 -24 z"
                fill="url(#softCloudGrad)"
                opacity="0.75"
              />
            </g>
            <g className="scene-cloud scene-cloud-drift-4">
              <path
                d="M80 110 a15 15 0 0 1 26 -6 a22 22 0 0 1 40 3 a15 15 0 0 1 20 12 a10 10 0 0 1 -10 10 h-66 a12 12 0 0 1 -10 -19 z"
                fill="url(#softCloudGrad)"
                opacity="0.6"
              />
            </g>
          </g>
        )}

        {/* Rain / Thunder: Dark drifting storm clouds */}
        {(mode === 'rain' || mode === 'thunder') && (
          <g>
            <g className="scene-cloud scene-cloud-drift-1">
              <path
                d="M20 50 a26 26 0 0 1 42 -12 a38 38 0 0 1 68 6 a24 24 0 0 1 32 20 a18 18 0 0 1 -18 18 h-108 a20 20 0 0 1 -16 -32 z"
                fill="url(#darkCloudGrad)"
              />
            </g>
            <g className="scene-cloud scene-cloud-drift-2">
              <path
                d="M220 35 a22 22 0 0 1 36 -10 a32 32 0 0 1 58 5 a20 20 0 0 1 28 17 a16 16 0 0 1 -16 16 h-92 a18 18 0 0 1 -14 -28 z"
                fill="url(#darkCloudGrad)"
                opacity="0.9"
              />
            </g>
          </g>
        )}

        {/* ========================================================
            Precipitation & Atmospheric Layers
            ======================================================== */}

        {/* Rain / Thunderstorm: 24 animated diagonal raindrops */}
        {(mode === 'rain' || mode === 'thunder') && (
          <g className="scene-rain-layer">
            {RAIN_DROPS.map((drop) => (
              <line
                key={drop.id}
                x1={drop.x}
                y1={drop.y}
                x2={drop.x - 7}
                y2={drop.y + 18}
                stroke="rgba(191, 219, 254, 0.85)"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="scene-rain-drop"
                style={{
                  animationDelay: drop.delay,
                  animationDuration: drop.duration,
                }}
              />
            ))}
          </g>
        )}

        {/* Snow: 20 gently swaying snowflakes */}
        {mode === 'snow' && (
          <g className="scene-snow-layer">
            {SNOWFLAKES.map((flake) => (
              <circle
                key={flake.id}
                cx={flake.x}
                cy={flake.y}
                r={flake.r}
                fill="#FFFFFF"
                className="scene-snowflake"
                style={{
                  animationDelay: flake.delay,
                  animationDuration: flake.duration,
                }}
              />
            ))}
          </g>
        )}

        {/* Fog / Haze: Translucent drifting haze band */}
        {mode === 'fog' && (
          <g className="scene-fog-layer">
            <rect x="-80" y="115" width="660" height="95" fill="url(#fogGrad)" />
            <rect x="-40" y="160" width="580" height="60" fill="url(#fogGrad)" opacity="0.75" />
          </g>
        )}

        {/* ========================================================
            Distant & Mid Mountain Landscape Silhouettes
            ======================================================== */}

        {/* Back Distant Mountains */}
        <path
          d="M0 320 L0 180 Q80 140 160 170 T320 150 Q410 130 500 170 L500 320 Z"
          fill="url(#mountainBack)"
        />

        {/* Mid Mountain Ridges */}
        <path
          d="M0 320 L0 210 Q90 180 180 200 T360 185 Q430 170 500 205 L500 320 Z"
          fill="url(#mountainMid)"
        />

        {/* Iconic White Architectural Monument (Mazar-e-Quaid) */}
        <g transform="translate(320, 140)">
          {/* Main Dome Structure */}
          <path
            d="M20 140 V70 C20 30 55 10 90 10 C125 10 160 30 160 70 V140 H20 Z"
            fill="url(#monumentGrad)"
          />
          {/* Dome Spire / Finial */}
          <line x1="90" y1="10" x2="90" y2="0" stroke="#F8FAFC" strokeWidth="2.5" />
          <circle cx="90" cy="0" r="2.5" fill="#F8FAFC" />
          {/* Central Arch Portal */}
          <path
            d="M65 140 V95 C65 80 80 72 90 72 C100 72 115 80 115 95 V140 H65 Z"
            fill="#0F172A"
            opacity="0.85"
          />
          {/* Stepped Base Podium */}
          <rect x="0" y="130" width="180" height="15" rx="2" fill="#334155" opacity="0.9" />
          <rect x="10" y="122" width="160" height="10" rx="2" fill="#475569" opacity="0.85" />
        </g>

        {/* Foreground Mountain Ridge with Pine Trees */}
        <path
          d="M0 320 L0 250 Q110 220 220 240 T440 230 L500 245 L500 320 Z"
          fill="url(#mountainFront)"
        />

        {/* Pine Tree Silhouettes along the slope */}
        <g fill="#0B1120">
          {/* Tree 1 */}
          <polygon points="40,240 45,260 35,260" />
          <polygon points="40,248 48,272 32,272" />
          {/* Tree 2 */}
          <polygon points="70,230 76,252 64,252" />
          <polygon points="70,242 80,266 60,266" />
          {/* Tree 3 */}
          <polygon points="110,235 115,255 105,255" />
          <polygon points="110,245 118,268 102,268" />
          {/* Tree 4 */}
          <polygon points="180,245 186,265 174,265" />
          <polygon points="180,255 190,278 170,278" />
          {/* Tree 5 */}
          <polygon points="260,250 265,270 255,270" />
          {/* Tree 6 */}
          <polygon points="450,260 456,280 444,280" />
        </g>
      </svg>
    </div>
  );
});
