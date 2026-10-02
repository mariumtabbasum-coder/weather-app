export interface CityLocation {
  id: number;
  name: string;
  country: string;
  country_code?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  isCountry?: boolean;
  capitalName?: string;
  feature_code?: string;
  population?: number;
}

export interface CurrentWeatherRaw {
  time: string;
  interval?: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  visibility: number;
}

export interface HourlyWeatherRaw {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  weather_code: number[];
  surface_pressure: number[];
  wind_speed_10m: number[];
  visibility: number[];
  is_day?: number[];
}

export interface DailyWeatherRaw {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_probability_max: number[];
}

export interface AirQualityRaw {
  current?: {
    time: string;
    european_aqi?: number;
    us_aqi?: number;
    pm10?: number;
    pm2_5?: number;
    carbon_monoxide?: number;
    nitrogen_dioxide?: number;
    sulphur_dioxide?: number;
    ozone?: number;
  };
}

export interface WeatherData {
  city: CityLocation;
  current: CurrentWeatherRaw;
  hourly: HourlyWeatherRaw;
  daily: DailyWeatherRaw;
  airQuality?: AirQualityRaw['current'];
  fetchedAt: number; // timestamp
}

export interface AppSettings {
  theme: 'dark' | 'light';
  unit: 'celsius' | 'fahrenheit';
  alerts: boolean;
  defaultCity: CityLocation;
}

export type ScreenType = 'splash' | 'home' | 'forecast' | 'hourly' | 'details' | 'map' | 'settings' | 'search';
