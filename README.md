# SkyCast — Modern Weather & Forecast Web App

Built by Marium Tabbasum for the **SYNTECXHUB Web Development Internship**.

SkyCast is a responsive, portfolio-quality weather application crafted with React (Vite) and plain CSS. Designed around a dark navy theme with glassmorphism surfaces, soft glowing borders, Feather-style line icons, and dynamic weather scenery (sun, moon, twinkling stars, clouds, rain, thunder, snow, and mountain silhouettes).

---

## Features

- **Real-Time Weather**: Current temperature, weather condition, feels-like temperature, humidity, and wind speed.
- **7-Day Forecast**: Day-by-day outlook with high/low temperatures, weather icons, conditions, and precipitation probabilities.
- **Hourly Forecast**: Next 24 hours starting directly from "Now" with an interactive horizontal hour selector and full atmospheric metrics.
- **Weather Details**: Circular hero temperature display, pressure (hPa), visibility (km/mi), sunrise & sunset times, UV Index, and an Air Quality Index (AQI) card with pollutant breakdowns.
- **Interactive Weather Map**: Powered by Leaflet with CartoDB Dark Matter tiles. Tap anywhere on the globe to inspect real-time weather with reverse geocoding fallback.
- **Debounced Search**: Instant city suggestions (Open-Meteo Geocoding) with 400ms debouncing, keyboard navigation, and network error resilience.
- **Geolocation**: "Use My Location" button to fetch weather directly from browser GPS coordinates.
- **In-App Weather Alerts**: Automatic severe weather banners for thunderstorms, heavy downpours, extreme heat, and high UV levels.
- **Settings & Preferences**:
  - Dark / Light mode toggle
  - Metric (°C, km/h) / Imperial (°F, mph) unit conversions
  - Weather alert notifications toggle
  - Set custom default location (persisted in `localStorage`)
- **Offline & Performance Optimized**:
  - `navigator.onLine` checks and offline banner ("You are offline. Showing last loaded data.")
  - In-memory 10-minute caching to eliminate duplicate requests
  - LocalStorage caching for instant offline fallback
  - Lightweight CSS-only transforms and opacity animations
  - Lazy-loaded map component to ensure rapid first-contentful paint

---

## Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Pure CSS with CSS custom properties (variables), glassmorphic design, and Tailwind utility support
- **Icons**: Lucide React (Feather style) + custom inline animated SVG weather icons
- **Mapping**: Leaflet + CartoDB Dark Matter tile layer
- **APIs**:
  - [Open-Meteo Forecast API](https://open-meteo.com/) (Free, no API key needed)
  - [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
  - [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)
  - [BigDataCloud Reverse Geocoding API](https://www.bigdatacloud.com/)

---

## Project Structure

```
├── index.html                    # Entry HTML with Poppins font and meta tags
├── package.json                  # Dependencies and scripts
├── src/
│   ├── App.tsx                   # Main app shell & screen routing
│   ├── main.tsx                  # Root mount
│   ├── index.css                 # Global CSS entry
│   ├── components/
│   │   ├── AirQualityCard.tsx    # AQI progress bar & pollutants
│   │   ├── BottomNav.tsx         # Mobile bottom tab bar
│   │   ├── DailyList.tsx         # 7-day forecast cards
│   │   ├── DetailCard.tsx        # Atmospheric metric card
│   │   ├── EmptyState.tsx        # "No Results Found" fallback
│   │   ├── ErrorState.tsx        # "Something went wrong" with retry
│   │   ├── HourlyList.tsx        # 24-hour horizontal selector & detail card
│   │   ├── QuickForecastStrip.tsx# 5-day strip for Home
│   │   ├── SearchBar.tsx         # Debounced live search with dropdown
│   │   ├── SettingsRow.tsx       # Toggles, unit switcher & about modal
│   │   ├── Sidebar.tsx           # Desktop navigation sidebar
│   │   ├── Skeleton.tsx          # Shimmer loaders matching layout
│   │   ├── SplashScreen.tsx      # Onboarding screen with "Get Started"
│   │   ├── WeatherAlertBanner.tsx# Severe conditions alert banner
│   │   ├── WeatherBackground.tsx # Pure CSS dynamic weather scenery
│   │   ├── WeatherCard.tsx       # Hero card with Mazar/mountain skyline
│   │   ├── WeatherIcon.tsx       # Inline SVG weather symbols
│   │   └── WeatherMap.tsx        # Interactive Leaflet map (lazy-loaded)
│   ├── hooks/
│   │   └── useWeather.ts         # Custom weather hook with caching & offline recovery
│   ├── pages/
│   │   ├── Details.tsx           # Comprehensive metrics & AQI
│   │   ├── Forecast.tsx          # 7-day forecast page
│   │   ├── Home.tsx              # Main dashboard
│   │   ├── Hourly.tsx            # 24-hour forecast page
│   │   ├── MapPage.tsx           # Map container with Suspense
│   │   └── Settings.tsx          # Configuration preferences
│   ├── services/
│   │   └── weatherApi.ts         # Open-Meteo fetching, timeouts & caching
│   ├── styles/
│   │   ├── components.css        # Component & animation styling
│   │   ├── global.css            # Custom scrollbars, reset, typography
│   │   └── variables.css         # Color palette & theme tokens
│   ├── types/
│   │   └── weather.ts            # TypeScript interfaces
│   └── utils/
│       ├── formatters.ts         # Safe time & unit formatting
│       └── weatherCodes.ts       # WMO weather code mapping & alerts
└── README.md
```

---

## How to Run

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your web browser.

---

## What I Learned

During this project for the SYNTECXHUB internship, I gained deep practical insights into:
1. **Time Handling with External APIs**: Open-Meteo returns city-local timestamps as strings without time zone offsets (e.g. `2026-09-28T06:55`). Passing these to `new Date()` without care causes the browser to shift the hour to the viewer's local timezone. Parsing the time string directly guarantees that local sunrise, sunset, and hourly forecasts always reflect the searched city (such as Karachi, Tokyo, or New York).
2. **Resilient Network & Offline States**: Using `navigator.onLine`, event listeners, AbortController timeouts, and local storage fallback caching prevents blank screens or frozen loading spinners when the internet drops.
3. **Performance Optimization in React**: Avoiding high-level state triggers by isolating debounced input state inside `SearchBar`, parallelizing requests with `Promise.all`, caching repeated coordinate queries in a Map, and lazy loading heavy dependencies like Leaflet.
4. **Accessible Glassmorphism**: Designing multi-layered glass cards with solid fallbacks and low backdrop-filter blur radii (10px) to balance modern aesthetics with smooth 60fps rendering across devices.

---

## Credits

- Weather and Geocoding data provided by [Open-Meteo](https://open-meteo.com/).
- Reverse Geocoding by [BigDataCloud](https://www.bigdatacloud.com/).
- Map tiles by [CartoDB](https://carto.com/) and [OpenStreetMap](https://openstreetmap.org).
- Developed for the **SYNTECXHUB Web Development Internship**.
