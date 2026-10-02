export interface WeatherCondition {
  code: number;
  label: string;
  type: 'clear' | 'partly-cloudy' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunder';
}

export function getWeatherCondition(code: number, isDay = 1): WeatherCondition {
  switch (code) {
    case 0:
      return { code, label: isDay ? 'Sunny' : 'Clear Sky', type: 'clear' };
    case 1:
      return { code, label: isDay ? 'Mainly Sunny' : 'Mainly Clear', type: 'clear' };
    case 2:
      return { code, label: 'Partly Cloudy', type: 'partly-cloudy' };
    case 3:
      return { code, label: 'Overcast', type: 'cloudy' };
    case 45:
      return { code, label: 'Foggy', type: 'fog' };
    case 48:
      return { code, label: 'Depositing Rime Fog', type: 'fog' };
    case 51:
      return { code, label: 'Light Drizzle', type: 'drizzle' };
    case 53:
      return { code, label: 'Moderate Drizzle', type: 'drizzle' };
    case 55:
      return { code, label: 'Dense Drizzle', type: 'drizzle' };
    case 56:
    case 57:
      return { code, label: 'Freezing Drizzle', type: 'drizzle' };
    case 61:
      return { code, label: 'Slight Rain', type: 'rain' };
    case 63:
      return { code, label: 'Moderate Rain', type: 'rain' };
    case 65:
      return { code, label: 'Heavy Rain', type: 'rain' };
    case 66:
    case 67:
      return { code, label: 'Freezing Rain', type: 'rain' };
    case 71:
      return { code, label: 'Slight Snow', type: 'snow' };
    case 73:
      return { code, label: 'Moderate Snow', type: 'snow' };
    case 75:
      return { code, label: 'Heavy Snow', type: 'snow' };
    case 77:
      return { code, label: 'Snow Grains', type: 'snow' };
    case 80:
      return { code, label: 'Light Showers', type: 'rain' };
    case 81:
      return { code, label: 'Showers', type: 'rain' };
    case 82:
      return { code, label: 'Heavy Rain Showers', type: 'rain' };
    case 85:
      return { code, label: 'Light Snow Showers', type: 'snow' };
    case 86:
      return { code, label: 'Heavy Snow Showers', type: 'snow' };
    case 95:
      return { code, label: 'Thunderstorm', type: 'thunder' };
    case 96:
      return { code, label: 'Thunderstorm with Hail', type: 'thunder' };
    case 99:
      return { code, label: 'Severe Thunderstorm', type: 'thunder' };
    default:
      return { code, label: 'Partly Cloudy', type: 'partly-cloudy' };
  }
}

export interface WeatherAlertInfo {
  severity: 'warning' | 'advisory';
  title: string;
  description: string;
}

export function detectWeatherAlert(
  weatherCode: number,
  temperature: number,
  windSpeed: number,
  uvIndex?: number
): WeatherAlertInfo | null {
  // Thunderstorm
  if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) {
    return {
      severity: 'warning',
      title: 'Thunderstorm Warning',
      description: 'Lightning and heavy downpours reported in your area. Stay indoors if possible.'
    };
  }

  // Heavy rain
  if (weatherCode === 65 || weatherCode === 82) {
    return {
      severity: 'warning',
      title: 'Heavy Rainfall Warning',
      description: 'Intense rain showers may cause localized water accumulation and reduced visibility.'
    };
  }

  // Extreme wind
  if (windSpeed >= 50) {
    return {
      severity: 'warning',
      title: 'High Wind Warning',
      description: `Gusts reaching ${Math.round(windSpeed)} km/h. Secure loose outdoor objects.`
    };
  }

  // Extreme heat
  if (temperature >= 40) {
    return {
      severity: 'warning',
      title: 'Extreme Heat Advisory',
      description: 'Temperatures exceeding 40°C. Stay hydrated and avoid prolonged direct sun exposure.'
    };
  }

  // Very high UV index
  if (uvIndex !== undefined && uvIndex >= 8) {
    return {
      severity: 'advisory',
      title: 'Very High UV Alert',
      description: `UV Index is ${Math.round(uvIndex)}. Sun protection, shade, and sunglasses recommended.`
    };
  }

  return null;
}

export function getAirQualityStatus(aqi?: number): {
  label: string;
  percentage: number;
  colorClass: string;
  description: string;
} {
  if (aqi === undefined || aqi === null) {
    return {
      label: 'Good',
      percentage: 20,
      colorClass: 'aqi-good',
      description: 'Air quality is satisfactory for most people.'
    };
  }

  // European AQI scale typically 1 - 5 (or US AQI 0-500)
  // Let's support both if Open-Meteo European AQI (0-100) or US AQI (0-500)
  if (aqi <= 20) {
    return {
      label: 'Good',
      percentage: Math.min(100, Math.max(15, (aqi / 50) * 100)),
      colorClass: 'aqi-good',
      description: 'Air quality is satisfactory and poses little or no risk.'
    };
  } else if (aqi <= 40) {
    return {
      label: 'Fair',
      percentage: 40,
      colorClass: 'aqi-fair',
      description: 'Air quality is acceptable; however, some pollutants may affect sensitive groups.'
    };
  } else if (aqi <= 60) {
    return {
      label: 'Moderate',
      percentage: 60,
      colorClass: 'aqi-moderate',
      description: 'Members of sensitive groups may experience mild health effects.'
    };
  } else if (aqi <= 80) {
    return {
      label: 'Poor',
      percentage: 80,
      colorClass: 'aqi-poor',
      description: 'Everyone may begin to experience adverse effects in sensitive outdoor environments.'
    };
  } else {
    return {
      label: 'Very Poor',
      percentage: 100,
      colorClass: 'aqi-very-poor',
      description: 'Health warning of emergency conditions. The entire population is likely affected.'
    };
  }
}
