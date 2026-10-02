import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  CloudSun,
  Menu,
  X,
  Home,
  Calendar,
  Clock,
  BarChart2,
  Map,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { ScreenType } from '../types/weather';

interface MobileHeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  theme?: 'dark' | 'light';
}

const NAV_ITEMS: { screen: ScreenType; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { screen: 'home', label: 'Home', icon: Home },
  { screen: 'forecast', label: '7-Day Forecast', icon: Calendar },
  { screen: 'hourly', label: 'Hourly Forecast', icon: Clock },
  { screen: 'details', label: 'Weather Details', icon: BarChart2 },
  { screen: 'map', label: 'Weather Map', icon: Map },
  { screen: 'settings', label: 'Settings', icon: Settings },
];

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when navigating or pressing Escape
  const handleSelect = (screen: ScreenType) => {
    onNavigate(screen);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header className="mobile-header md:hidden">
      <div className="mobile-header-bar">
        {/* Brand Logo & Name */}
        <button
          type="button"
          className="flex items-center gap-2.5 text-left cursor-pointer"
          onClick={() => handleSelect('home')}
          aria-label="Go to Home"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
            <CloudSun size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-[var(--text)] tracking-tight">SkyCast</span>
        </button>

        {/* Hamburger Toggle Button */}
        <button
          type="button"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text)] bg-[var(--pill-bg)] border border-[var(--border)] active:scale-95 transition-transform"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Slide-down / Dropdown Menu Drawer rendered via Portal */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="mobile-nav-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          >
            <nav
              className="mobile-nav-drawer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Mobile Navigation Drawer"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--border)] px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Navigation
                </span>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--pill-bg)] transition-colors"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-1.5 py-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.screen;
                  return (
                    <button
                      key={item.screen}
                      type="button"
                      className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => handleSelect(item.screen)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                              : 'bg-[var(--pill-bg)] text-[var(--text-muted)]'
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <span className="font-semibold text-sm text-[var(--text)]">
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={isActive ? 'text-indigo-400' : 'text-[var(--text-muted)] opacity-60'}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border)] text-center">
                <span className="text-xs text-[var(--text-muted)]">
                  SkyCast Weather © 2026
                </span>
              </div>
            </nav>
          </div>,
          document.body
        )}
    </header>
  );
};

export default MobileHeader;
