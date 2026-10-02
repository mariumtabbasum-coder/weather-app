import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Search, MapPin, X, Loader2, Navigation } from 'lucide-react';
import { searchCities } from '../services/weatherApi';
import { CityLocation } from '../types/weather';

interface SearchBarProps {
  onSelectCity: (city: CityLocation) => void;
  onUseLocation: () => void;
  isLoadingLocation?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = React.memo(({
  onSelectCity,
  onUseLocation,
  isLoadingLocation = false,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CityLocation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced live suggestions search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setErrorMessage(null);
      setIsSearching(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsSearching(true);
    setErrorMessage(null);

    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed, controller.signal);
        setSuggestions(results);
        setIsOpen(true);
        if (results.length === 0) {
          setErrorMessage('No matching locations found.');
        } else {
          setErrorMessage(null);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setSuggestions([]);
        setErrorMessage("Can't load suggestions right now");
        setIsOpen(true);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (city: CityLocation) => {
      setQuery('');
      setSuggestions([]);
      setIsOpen(false);
      onSelectCity(city);
    },
    [onSelectCity]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setErrorMessage(null);
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  return (
    <div className="search-container" ref={containerRef}>
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" style={{ color: 'var(--text-muted)' }} />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search city (e.g. Karachi, Lahore, London)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0 || errorMessage) {
              setIsOpen(true);
            }
          }}
        />

        {query && (
          <button
            type="button"
            className="search-action-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}

        <button
          type="button"
          className="search-action-btn"
          onClick={onUseLocation}
          title="Use my current location"
          aria-label="Use my current location"
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <Loader2 size={18} className="animate-spin text-indigo-400" />
          ) : (
            <Navigation size={18} style={{ color: 'var(--color-indigo-light)' }} />
          )}
        </button>
      </div>

      {isOpen && (suggestions.length > 0 || errorMessage || isSearching) && (
        <div className="search-dropdown">
          {isSearching && (
            <div className="search-status-msg flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span>Searching locations...</span>
            </div>
          )}

          {!isSearching && errorMessage && (
            <div className="search-status-msg">{errorMessage}</div>
          )}

          {!isSearching &&
            suggestions.map((loc) => {
              const isCountry = loc.isCountry || (loc.country && loc.name.trim().toLowerCase() === loc.country.trim().toLowerCase());

              return (
                <button
                  key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                  type="button"
                  className={`search-dropdown-item ${isCountry ? 'search-country-item' : ''}`}
                  onClick={() => handleSelect(loc)}
                >
                  <div className="search-item-info">
                    <div className="flex items-center gap-2">
                      <span className="search-item-name">{loc.name}</span>
                      {isCountry && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                          Country
                        </span>
                      )}
                    </div>
                    <span className="search-item-sub">
                      {isCountry
                        ? (loc.capitalName ? `Weather for capital: ${loc.capitalName}` : 'Country')
                        : `${loc.admin1 && loc.admin1 !== loc.name && loc.admin1 !== loc.country ? `${loc.admin1}, ` : ''}${loc.country}`}
                    </span>
                  </div>
                  <MapPin size={15} style={{ color: isCountry ? 'var(--primary)' : 'var(--text-muted)' }} />
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
});
