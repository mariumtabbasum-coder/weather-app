import React, { useState } from 'react';
import { Moon, Sun, Thermometer, Bell, MapPin, Info, X, Search, RotateCcw, Check, Navigation } from 'lucide-react';
import { AppSettings, CityLocation } from '../types/weather';
import { DEFAULT_CITY } from '../hooks/useWeather';
import { searchCities } from '../services/weatherApi';
import { AboutModal } from './AboutModal';

interface SettingsRowProps {
  settings: AppSettings;
  currentCity: CityLocation;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  settings,
  currentCity,
  onUpdateSettings,
}) => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Modal search state for changing default location
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const isKarachiDefault =
    settings.defaultCity.name === 'Karachi' &&
    Math.abs(settings.defaultCity.latitude - DEFAULT_CITY.latitude) < 0.1;

  const handleSearchLocations = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    try {
      const results = await searchCities(query.trim());
      setSearchResults(results);
      if (results.length === 0) {
        setSearchError('No locations found matching that query.');
      }
    } catch {
      setSearchError('Could not load locations. Check network connection.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectNewDefault = (selected: CityLocation) => {
    onUpdateSettings({ defaultCity: selected });
    setShowLocationModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleResetToKarachi = () => {
    onUpdateSettings({ defaultCity: DEFAULT_CITY });
    setShowLocationModal(false);
  };

  return (
    <div className="settings-section">
      <div className="settings-card glass-card">
        {/* Dark Mode Toggle */}
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-icon-box">
              {settings.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <div className="settings-title">Dark Mode</div>
              <div className="settings-subtitle">
                {settings.theme === 'dark' ? 'On' : 'Off'}
              </div>
            </div>
          </div>

          <div
            className={`toggle-switch ${settings.theme === 'dark' ? 'checked' : ''}`}
            onClick={() =>
              onUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
            }
            role="switch"
            aria-checked={settings.theme === 'dark'}
            tabIndex={0}
            title="Toggle theme"
          >
            <div className="toggle-knob" />
          </div>
        </div>

        {/* Temperature Unit */}
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-icon-box">
              <Thermometer size={18} />
            </div>
            <div>
              <div className="settings-title">Temperature Unit</div>
              <div className="settings-subtitle">
                {settings.unit === 'celsius' ? '°C (Celsius, km/h)' : '°F (Fahrenheit, mph)'}
              </div>
            </div>
          </div>

          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${settings.unit === 'celsius' ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ unit: 'celsius' })}
            >
              °C
            </button>
            <button
              type="button"
              className={`segmented-btn ${settings.unit === 'fahrenheit' ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ unit: 'fahrenheit' })}
            >
              °F
            </button>
          </div>
        </div>

        {/* Weather Alerts */}
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-icon-box">
              <Bell size={18} />
            </div>
            <div>
              <div className="settings-title">Weather Alerts</div>
              <div className="settings-subtitle">
                Severe weather banners on Home
              </div>
            </div>
          </div>

          <div
            className={`toggle-switch ${settings.alerts ? 'checked' : ''}`}
            onClick={() => onUpdateSettings({ alerts: !settings.alerts })}
            role="switch"
            aria-checked={settings.alerts}
            tabIndex={0}
            title="Toggle weather alerts"
          >
            <div className="toggle-knob" />
          </div>
        </div>

        {/* Default Location */}
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-icon-box">
              <MapPin size={18} />
            </div>
            <div>
              <div className="settings-title">Default Location</div>
              <div className="settings-subtitle">
                Currently: {settings.defaultCity.name}, {settings.defaultCity.country}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isKarachiDefault && (
              <button
                type="button"
                className="btn-secondary text-xs py-1.5 px-3"
                onClick={handleResetToKarachi}
                title="Reset default to Karachi"
              >
                <RotateCcw size={13} />
                <span>Reset to Karachi</span>
              </button>
            )}

            <button
              type="button"
              className="btn-secondary text-xs py-1.5 px-3"
              onClick={() => setShowLocationModal(true)}
            >
              Change
            </button>
          </div>
        </div>

        {/* About App */}
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-icon-box">
              <Info size={18} />
            </div>
            <div>
              <div className="settings-title">About App</div>
              <div className="settings-subtitle">Version 1.0.0</div>
            </div>
          </div>

          <button
            type="button"
            className="btn-secondary text-xs py-1.5 px-3"
            onClick={() => setShowAboutModal(true)}
          >
            Details
          </button>
        </div>
      </div>

      {/* Change Default Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card p-6 max-w-md w-full relative">
            <button
              type="button"
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text)] p-1"
              onClick={() => setShowLocationModal(false)}
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-[var(--text)] mb-2">Change Default City</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">
              Choose the primary city that loads every time you open SkyCast.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 mb-4">
              <button
                type="button"
                className="btn-secondary text-xs py-2 px-3 justify-start"
                onClick={() => handleSelectNewDefault(currentCity)}
              >
                <Navigation size={14} className="text-indigo-500" />
                <span>Use current viewed city: <strong>{currentCity.name}</strong></span>
              </button>

              <button
                type="button"
                className="btn-secondary text-xs py-2 px-3 justify-start"
                onClick={handleResetToKarachi}
              >
                <RotateCcw size={14} className="text-emerald-500" />
                <span>Reset to Karachi, Pakistan</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="search-input-wrapper mb-3">
              <Search size={16} className="text-[var(--text-muted)]" />
              <input
                type="text"
                className="search-input"
                placeholder="Search city name..."
                value={searchQuery}
                onChange={(e) => handleSearchLocations(e.target.value)}
              />
            </div>

            {isSearching && (
              <div className="text-xs text-[var(--text-muted)] py-2 text-center">
                Searching locations...
              </div>
            )}

            {searchError && (
              <div className="text-xs text-amber-500 py-1 text-center">
                {searchError}
              </div>
            )}

            {/* Results List */}
            <div className="max-h-44 overflow-y-auto space-y-1">
              {searchResults.map((item) => (
                <button
                  key={`${item.id}-${item.latitude}`}
                  type="button"
                  className="search-dropdown-item w-full"
                  onClick={() => handleSelectNewDefault(item)}
                >
                  <div className="search-item-info">
                    <span className="search-item-name">{item.name}</span>
                    <span className="search-item-sub">
                      {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                    </span>
                  </div>
                  <Check size={14} className="text-indigo-500 opacity-60" />
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-end">
              <button
                type="button"
                className="btn-secondary text-xs py-1.5 px-4"
                onClick={() => setShowLocationModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About App Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        theme={settings.theme}
      />
    </div>
  );
};
