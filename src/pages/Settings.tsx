import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { AppSettings, CityLocation, ScreenType } from '../types/weather';
import { SettingsRow } from '../components/SettingsRow';

interface SettingsProps {
  settings: AppSettings;
  currentCity: CityLocation;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  currentCity,
  onUpdateSettings,
  onNavigate,
}) => {
  return (
    <div className="content-wrapper">
      {/* Top Bar with Clear Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="search-action-btn"
            onClick={() => onNavigate('home')}
            aria-label="Back to Home"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold text-[var(--text)]">Settings</h1>
        </div>
      </div>

      <SettingsRow
        settings={settings}
        currentCity={currentCity}
        onUpdateSettings={onUpdateSettings}
      />
    </div>
  );
};
