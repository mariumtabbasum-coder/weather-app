import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, Home, Star, Loader2, AlertCircle } from 'lucide-react';
import { CityLocation, WeatherData } from '../types/weather';
import { getWeatherCondition } from '../utils/weatherCodes';
import { formatFullDate } from '../utils/formatters';
import { WeatherIcon } from './WeatherIcon';
import { fetchWeatherData } from '../services/weatherApi';

interface WeatherMapProps {
  weatherData: WeatherData;
  unit: 'celsius' | 'fahrenheit';
  theme?: 'dark' | 'light';
  onViewOnHome: (city: CityLocation) => void;
  onSetAsDefault: (city: CityLocation) => void;
  onUseLocation: () => void;
  isLoadingLocation?: boolean;
}

export const WeatherMap: React.FC<WeatherMapProps> = ({
  weatherData,
  unit,
  theme = 'dark',
  onViewOnHome,
  onSetAsDefault,
  onUseLocation,
  isLoadingLocation = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Local state for the inspected point on the map (never mutates Home city automatically)
  const [inspectedCity, setInspectedCity] = useState<CityLocation>(weatherData.city);
  const [inspectedCurrent, setInspectedCurrent] = useState(weatherData.current);
  const [isLoadingPoint, setIsLoadingPoint] = useState(false);
  const [tileError, setTileError] = useState(false);
  const [justSavedDefault, setJustSavedDefault] = useState(false);

  // Custom SVG DivIcon using primary color #6366F1
  const createPinIcon = useCallback(() => {
    return L.divIcon({
      className: 'custom-leaflet-pin',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: #6366F1;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid #FFFFFF;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 10px;
            height: 10px;
            background: #FFFFFF;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }, []);

  // Fetch weather and reverse geocode for clicked map point
  const handleMapClick = useCallback(async (lat: number, lon: number) => {
    setIsLoadingPoint(true);
    let placeName = `Selected location (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
    let countryName = '';

    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      if (res.ok) {
        const data = await res.json();
        // Priority order: city -> locality -> principalSubdivision -> countryName
        placeName =
          data.city ||
          data.locality ||
          data.principalSubdivision ||
          data.countryName ||
          `Selected location (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
        countryName = data.countryName || '';
      }
    } catch {
      // Fallback is already initialized
    }

    const clickedCity: CityLocation = {
      id: Math.round(lat * 1000 + lon),
      name: placeName,
      country: countryName,
      latitude: lat,
      longitude: lon,
    };

    setInspectedCity(clickedCity);

    try {
      const pointWeather = await fetchWeatherData(clickedCity, undefined, true);
      setInspectedCurrent(pointWeather.current);
    } catch {
      // Keep previous or fallback
    } finally {
      setIsLoadingPoint(false);
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // OpenStreetMap tiles without any API key
      const osmTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });

      osmTileLayer.on('tileerror', () => {
        setTileError(true);
      });

      const map = L.map(mapContainerRef.current, {
        center: [weatherData.city.latitude, weatherData.city.longitude],
        zoom: 10,
        zoomControl: false,
      });

      osmTileLayer.addTo(map);
      L.control.zoom({ position: 'topleft' }).addTo(map);

      let handleResize: (() => void) | null = null;
      let resizeTimer: NodeJS.Timeout | null = null;

      // Invalidate size to ensure map tiles perfectly match the container
      resizeTimer = setTimeout(() => {
        map.invalidateSize();
      }, 100);

      handleResize = () => {
        map.invalidateSize();
      };
      window.addEventListener('resize', handleResize);

      const marker = L.marker([weatherData.city.latitude, weatherData.city.longitude], {
        icon: createPinIcon(),
      }).addTo(map);
      markerRef.current = marker;

      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        handleMapClick(lat, lng);
      });

      mapInstanceRef.current = map;

      return () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        if (handleResize) window.removeEventListener('resize', handleResize);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, [weatherData.city.latitude, weatherData.city.longitude, createPinIcon, handleMapClick]);

  const condition = getWeatherCondition(inspectedCurrent.weather_code, inspectedCurrent.is_day);
  const tempVal =
    unit === 'fahrenheit'
      ? Math.round((inspectedCurrent.temperature_2m * 9) / 5 + 32)
      : Math.round(inspectedCurrent.temperature_2m);

  const handleSetDefault = () => {
    onSetAsDefault(inspectedCity);
    setJustSavedDefault(true);
    setTimeout(() => setJustSavedDefault(false), 2000);
  };

  return (
    <div className="map-page-container">
      <style>{`
        html[data-theme='dark'] .leaflet-tile-pane,
        [data-theme='dark'] .leaflet-tile-pane,
        .dark-theme-map .leaflet-tile-pane {
          filter: invert(1) hue-rotate(200deg) brightness(0.9) contrast(0.9) saturate(0.6) !important;
        }
        html[data-theme='dark'] .leaflet-tile,
        [data-theme='dark'] .leaflet-tile,
        .dark-theme-map .leaflet-tile {
          filter: none !important;
        }
        html[data-theme='dark'] .leaflet-container,
        [data-theme='dark'] .leaflet-container,
        .dark-theme-map.leaflet-container {
          background: #0b1120 !important;
        }
        html[data-theme='light'] .leaflet-tile-pane,
        [data-theme='light'] .leaflet-tile-pane,
        .light-theme-map .leaflet-tile-pane {
          filter: none !important;
        }
        html[data-theme='light'] .leaflet-tile,
        [data-theme='light'] .leaflet-tile,
        .light-theme-map .leaflet-tile {
          filter: none !important;
        }
        .leaflet-top.leaflet-left {
          top: 14px !important;
          left: 14px !important;
        }
        .leaflet-control-zoom {
          border: 1px solid var(--border) !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25) !important;
          background: var(--surface-solid) !important;
          background: var(--surface) !important;
          display: flex !important;
          flex-direction: column !important;
          z-index: 400 !important;
          margin: 0 !important;
        }
        .leaflet-control-zoom a.leaflet-control-zoom-in,
        .leaflet-control-zoom a.leaflet-control-zoom-out {
          background: var(--surface-solid) !important;
          background: var(--surface) !important;
          color: var(--text) !important;
          border: none !important;
          border-bottom: 1px solid var(--border) !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          text-align: center !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.15s ease !important;
          text-decoration: none !important;
        }
        .leaflet-control-zoom a.leaflet-control-zoom-out {
          border-bottom: none !important;
        }
        .leaflet-control-zoom a:hover {
          background: var(--pill-bg) !important;
          color: var(--primary) !important;
        }
      `}</style>
      <div
        ref={mapContainerRef}
        className={`map-element-holder ${theme === 'dark' ? 'dark-theme-map' : 'light-theme-map'}`}
      />

      {/* Tile loading error notification */}
      {tileError && (
        <div className="map-tile-error-banner flex items-center gap-1.5">
          <AlertCircle size={14} className="text-amber-500" />
          <span>Map tiles loading slowly. Weather inspections remain functional.</span>
        </div>
      )}

      {/* "My Location" Button */}
      <button
        type="button"
        className="map-my-location-btn"
        onClick={onUseLocation}
        title="Go to my location"
        disabled={isLoadingLocation}
        aria-label="Go to my location"
      >
        {isLoadingLocation ? (
          <Loader2 size={18} className="animate-spin text-indigo-500" />
        ) : (
          <Navigation size={18} />
        )}
      </button>

      {/* Floating Bottom Card */}
      <div className="map-floating-card">
        <div className="map-card-top-row">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <WeatherIcon
              code={inspectedCurrent.weather_code}
              isDay={inspectedCurrent.is_day}
              size={38}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin size={14} className="text-indigo-500 shrink-0" />
                <span className="font-bold text-sm text-[var(--text)] truncate block">
                  {inspectedCity.name}
                </span>
              </div>
              <span className="text-xs text-[var(--text-muted)] block truncate">
                {isLoadingPoint ? 'Updating...' : `${condition.label} · ${formatFullDate(inspectedCurrent.time)}`}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-bold tabular-nums text-[var(--text)]">
              {tempVal}°<span className="text-sm font-normal text-[var(--text-muted)]">{unit === 'fahrenheit' ? 'F' : 'C'}</span>
            </span>
            <span className="text-[11px] text-[var(--text-muted)] block">Current</span>
          </div>
        </div>

        {/* Action buttons: View on Home & Set as default */}
        <div className="map-card-actions">
          <button
            type="button"
            className="btn-primary text-xs py-1.5 px-2.5 sm:px-3 flex-1 min-w-0"
            onClick={() => onViewOnHome(inspectedCity)}
          >
            <Home size={13} className="shrink-0" />
            <span className="truncate">View on Home</span>
          </button>

          <button
            type="button"
            className="btn-secondary text-xs py-1.5 px-2.5 sm:px-3 flex-1 min-w-0"
            onClick={handleSetDefault}
          >
            <Star size={13} className="shrink-0" />
            <span className="truncate">{justSavedDefault ? 'Saved as Default!' : 'Set as default'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;
