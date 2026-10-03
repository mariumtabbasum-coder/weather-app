import React, { useCallback, useEffect, useRef, useState } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { DEFAULT_CITY, useWeather } from './hooks/useWeather';
import { AppSettings, CityLocation, ScreenType } from './types/weather';
import { WeatherBackground } from './components/WeatherBackground';
import { SplashScreen } from './components/SplashScreen';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { Home } from './pages/Home';
import { Forecast } from './pages/Forecast';
import { Hourly } from './pages/Hourly';
import { Details } from './pages/Details';
import { MapPage } from './pages/MapPage';
import { Settings } from './pages/Settings';

const SETTINGS_STORAGE_KEY = 'skycast_app_settings';
const SPLASH_SEEN_KEY = 'skycast_seen_splash';

function getInitialTheme(): 'dark' | 'light' {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.theme === 'dark' || parsed.theme === 'light') {
        return parsed.theme;
      }
    }
  } catch {
    // fallback to system preference
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

function getInitialSettings(): AppSettings {
  const baseSettings: AppSettings = {
    theme: getInitialTheme(),
    unit: 'celsius',
    alerts: true,
    defaultCity: DEFAULT_CITY,
  };

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Guard against accidental overwrite to Gadani or invalid location
      let city = parsed.defaultCity || DEFAULT_CITY;
      if (city.name === 'Gadani' && !city.country_code) {
        city = DEFAULT_CITY;
      }
      return { ...baseSettings, ...parsed, defaultCity: city };
    }
  } catch {
    // fallback
  }

  return baseSettings;
}

export default function App() {
  const [hasSeenSplash, setHasSeenSplash] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SPLASH_SEEN_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    try {
      const seen = localStorage.getItem(SPLASH_SEEN_KEY) === 'true';
      return seen ? 'home' : 'splash';
    } catch {
      return 'home';
    }
  });

  const [settings, setSettings] = useState<AppSettings>(getInitialSettings);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Network online/offline transition states
  const [showOnlineBanner, setShowOnlineBanner] = useState(false);
  const onlineTimerRef = useRef<number | null>(null);

  const {
    city,
    weatherData,
    isLoading,
    error,
    isOffline,
    isCachedData,
    selectCity,
    selectCoordinates,
    retry,
  } = useWeather(settings.defaultCity);

  // Apply theme attribute to html tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Handle network transition to display "Back online" green banner for 3s
  useEffect(() => {
    const handleOnline = () => {
      setShowOnlineBanner(true);
      if (onlineTimerRef.current) {
        clearTimeout(onlineTimerRef.current);
      }
      onlineTimerRef.current = window.setTimeout(() => {
        setShowOnlineBanner(false);
      }, 3000);
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
      if (onlineTimerRef.current) {
        clearTimeout(onlineTimerRef.current);
      }
    };
  }, []);

  const handleUpdateSettings = useCallback((newPartial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
        if (newPartial.defaultCity) {
          localStorage.setItem('skycast_default_city', JSON.stringify(newPartial.defaultCity));
        }
      } catch {
        // quota exceeded
      }
      return updated;
    });
  }, []);

  // "Use My Location" Geolocation button handler
  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLoadingLocation(false);
        selectCoordinates(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setIsLoadingLocation(false);
        alert('Could not access your location. Please check browser permissions.');
      },
      { timeout: 8000 }
    );
  }, [selectCoordinates]);

  // Map callbacks: does not mutate Home automatically; user explicitly clicks View or Save
  const handleViewOnHome = useCallback(
    (inspectedCity: CityLocation) => {
      selectCity(inspectedCity);
      setCurrentScreen('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [selectCity]
  );

  const handleSetMapAsDefault = useCallback(
    (inspectedCity: CityLocation) => {
      handleUpdateSettings({ defaultCity: inspectedCity });
    },
    [handleUpdateSettings]
  );

  const handleFinishSplash = useCallback(() => {
    try {
      localStorage.setItem(SPLASH_SEEN_KEY, 'true');
    } catch {
      // ignore
    }
    setHasSeenSplash(true);
    setCurrentScreen('home');
  }, []);

  const handleNavigate = useCallback((screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Splash Onboarding Screen
  if (!hasSeenSplash && currentScreen === 'splash') {
    return (
      <div className="app-container">
        <WeatherBackground
          weatherCode={0}
          isDay={0}
          isLoading={false}
          theme={settings.theme}
        />
        <SplashScreen onGetStarted={handleFinishSplash} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Background with Theme Support and No Page-Level Moon Overlap */}
      <WeatherBackground
        weatherCode={weatherData?.current?.weather_code}
        isDay={weatherData?.current?.is_day}
        isLoading={isLoading}
        theme={settings.theme}
      />

      {/* Mobile Top Header with Hamburger Navigation Menu */}
      <MobileHeader
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        theme={settings.theme}
      />

      {/* Desktop Sidebar Navigation */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Slim Offline / Online Status Bar */}
        {(isOffline || showOnlineBanner) && (
          <div className="offline-banner-container">
            {isOffline ? (
              <div className="offline-bar offline">
                <WifiOff size={16} />
                <span>You are offline. Showing last loaded data.</span>
              </div>
            ) : (
              showOnlineBanner && (
                <div className="offline-bar online">
                  <CheckCircle2 size={16} />
                  <span>Back online</span>
                </div>
              )
            )}
          </div>
        )}

        {currentScreen === 'home' && (
          <Home
            weatherData={weatherData}
            isLoading={isLoading}
            error={error}
            settings={settings}
            isCached={isCachedData}
            onSelectCity={selectCity}
            onUseLocation={handleUseLocation}
            isLoadingLocation={isLoadingLocation}
            onNavigate={handleNavigate}
            onRetry={retry}
          />
        )}

        {currentScreen === 'forecast' && (
          <Forecast
            weatherData={weatherData}
            unit={settings.unit}
            isLoading={isLoading}
            error={error}
            onNavigate={handleNavigate}
            onRetry={retry}
          />
        )}

        {currentScreen === 'hourly' && (
          <Hourly
            weatherData={weatherData}
            unit={settings.unit}
            theme={settings.theme}
            isLoading={isLoading}
            error={error}
            onNavigate={handleNavigate}
            onRetry={retry}
          />
        )}

        {currentScreen === 'details' && (
          <Details
            weatherData={weatherData}
            unit={settings.unit}
            isLoading={isLoading}
            error={error}
            onNavigate={handleNavigate}
            onRetry={retry}
          />
        )}

        {currentScreen === 'map' && (
          <MapPage
            weatherData={weatherData}
            unit={settings.unit}
            theme={settings.theme}
            isLoading={isLoading}
            error={error}
            onViewOnHome={handleViewOnHome}
            onSetAsDefault={handleSetMapAsDefault}
            onUseLocation={handleUseLocation}
            isLoadingLocation={isLoadingLocation}
            onNavigate={handleNavigate}
            onRetry={retry}
          />
        )}

        {currentScreen === 'settings' && (
          <Settings
            settings={settings}
            currentCity={city}
            onUpdateSettings={handleUpdateSettings}
            onNavigate={handleNavigate}
          />
        )}
      </main>
    </div>
  );
}
