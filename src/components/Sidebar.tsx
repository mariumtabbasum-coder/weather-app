import React from 'react';
import { Home, Calendar, Clock, BarChart2, Map, Settings, CloudSun } from 'lucide-react';
import { ScreenType } from '../types/weather';

interface SidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({
  currentScreen,
  onNavigate,
}) => {
  return (
    <aside className="sidebar" aria-label="Desktop Sidebar">
      <div>
        <div className="sidebar-brand">
          <div className="brand-icon-box">
            <CloudSun size={24} className="text-white" />
          </div>
          <span className="sidebar-title">SkyCast</span>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`sidebar-link ${currentScreen === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          <button
            type="button"
            className={`sidebar-link ${currentScreen === 'forecast' ? 'active' : ''}`}
            onClick={() => onNavigate('forecast')}
          >
            <Calendar size={18} />
            <span>7-Day Forecast</span>
          </button>

          <button
            type="button"
            className={`sidebar-link ${currentScreen === 'hourly' ? 'active' : ''}`}
            onClick={() => onNavigate('hourly')}
          >
            <Clock size={18} />
            <span>Hourly Forecast</span>
          </button>

          <button
            type="button"
            className={`sidebar-link ${currentScreen === 'details' ? 'active' : ''}`}
            onClick={() => onNavigate('details')}
          >
            <BarChart2 size={18} />
            <span>Weather Details</span>
          </button>

          <button
            type="button"
            className={`sidebar-link ${currentScreen === 'map' ? 'active' : ''}`}
            onClick={() => onNavigate('map')}
          >
            <Map size={18} />
            <span>Weather Map</span>
          </button>

          <button
            type="button"
            className={`sidebar-link ${currentScreen === 'settings' ? 'active' : ''}`}
            onClick={() => onNavigate('settings')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      <div className="px-3 py-4 text-xs border-t border-[var(--border)]">
        <span className="block font-medium text-[var(--text-muted)]">SkyCast © 2026</span>
      </div>
    </aside>
  );
});
