/**
 * Curated country capitals database and location disambiguation utilities.
 * Maps country codes and names to their recognized capital cities with precise coordinates.
 */

export interface CapitalInfo {
  name: string;
  capital: string;
  latitude: number;
  longitude: number;
}

export const COUNTRY_CAPITALS: Record<string, CapitalInfo> = {
  // Asia
  MY: { name: 'Malaysia', capital: 'Kuala Lumpur', latitude: 3.139, longitude: 101.6869 },
  PK: { name: 'Pakistan', capital: 'Islamabad', latitude: 33.6844, longitude: 73.0479 },
  IN: { name: 'India', capital: 'New Delhi', latitude: 28.6139, longitude: 77.209 },
  CN: { name: 'China', capital: 'Beijing', latitude: 39.9042, longitude: 116.4074 },
  JP: { name: 'Japan', capital: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  ID: { name: 'Indonesia', capital: 'Jakarta', latitude: -6.2088, longitude: 106.8456 },
  TH: { name: 'Thailand', capital: 'Bangkok', latitude: 13.7563, longitude: 100.5018 },
  SG: { name: 'Singapore', capital: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
  BD: { name: 'Bangladesh', capital: 'Dhaka', latitude: 23.8103, longitude: 90.4125 },
  PH: { name: 'Philippines', capital: 'Manila', latitude: 14.5995, longitude: 120.9842 },
  VN: { name: 'Vietnam', capital: 'Hanoi', latitude: 21.0285, longitude: 105.8542 },
  KR: { name: 'South Korea', capital: 'Seoul', latitude: 37.5665, longitude: 126.978 },
  SA: { name: 'Saudi Arabia', capital: 'Riyadh', latitude: 24.7136, longitude: 46.6753 },
  AE: { name: 'United Arab Emirates', capital: 'Abu Dhabi', latitude: 24.4539, longitude: 54.3773 },
  TR: { name: 'Turkey', capital: 'Ankara', latitude: 39.9334, longitude: 32.8597 },
  IR: { name: 'Iran', capital: 'Tehran', latitude: 35.6892, longitude: 51.389 },
  IQ: { name: 'Iraq', capital: 'Baghdad', latitude: 33.3152, longitude: 44.3661 },
  QA: { name: 'Qatar', capital: 'Doha', latitude: 25.2854, longitude: 51.531 },
  KW: { name: 'Kuwait', capital: 'Kuwait City', latitude: 29.3759, longitude: 47.9774 },
  OM: { name: 'Oman', capital: 'Muscat', latitude: 23.588, longitude: 58.3829 },
  LK: { name: 'Sri Lanka', capital: 'Colombo', latitude: 6.9271, longitude: 79.8612 },
  NP: { name: 'Nepal', capital: 'Kathmandu', latitude: 27.7172, longitude: 85.324 },
  AF: { name: 'Afghanistan', capital: 'Kabul', latitude: 34.5553, longitude: 69.2075 },
  UZ: { name: 'Uzbekistan', capital: 'Tashkent', latitude: 41.2995, longitude: 69.2401 },
  KZ: { name: 'Kazakhstan', capital: 'Astana', latitude: 51.1694, longitude: 71.4491 },
  MM: { name: 'Myanmar', capital: 'Naypyidaw', latitude: 19.7633, longitude: 96.0785 },
  KH: { name: 'Cambodia', capital: 'Phnom Penh', latitude: 11.5564, longitude: 104.9282 },
  LA: { name: 'Laos', capital: 'Vientiane', latitude: 17.9757, longitude: 102.6331 },
  JO: { name: 'Jordan', capital: 'Amman', latitude: 31.9454, longitude: 35.9284 },
  LB: { name: 'Lebanon', capital: 'Beirut', latitude: 33.8938, longitude: 35.5018 },
  IL: { name: 'Israel', capital: 'Jerusalem', latitude: 31.7683, longitude: 35.2137 },
  PS: { name: 'Palestine', capital: 'Ramallah', latitude: 31.9038, longitude: 35.2034 },
  BH: { name: 'Bahrain', capital: 'Manama', latitude: 26.2285, longitude: 50.586 },
  YE: { name: 'Yemen', capital: 'Sana\'a', latitude: 15.3694, longitude: 44.191 },
  GE: { name: 'Georgia', capital: 'Tbilisi', latitude: 41.7151, longitude: 44.8271 },
  AZ: { name: 'Azerbaijan', capital: 'Baku', latitude: 40.4093, longitude: 49.8671 },
  AM: { name: 'Armenia', capital: 'Yerevan', latitude: 40.1792, longitude: 44.4991 },
  MN: { name: 'Mongolia', capital: 'Ulaanbaatar', latitude: 47.8864, longitude: 106.9057 },
  TW: { name: 'Taiwan', capital: 'Taipei', latitude: 25.033, longitude: 121.5654 },

  // Europe
  GB: { name: 'United Kingdom', capital: 'London', latitude: 51.5074, longitude: -0.1278 },
  FR: { name: 'France', capital: 'Paris', latitude: 48.8566, longitude: 2.3522 },
  DE: { name: 'Germany', capital: 'Berlin', latitude: 52.52, longitude: 13.405 },
  IT: { name: 'Italy', capital: 'Rome', latitude: 41.9028, longitude: 12.4964 },
  ES: { name: 'Spain', capital: 'Madrid', latitude: 40.4168, longitude: -3.7038 },
  RU: { name: 'Russia', capital: 'Moscow', latitude: 55.7558, longitude: 37.6173 },
  NL: { name: 'Netherlands', capital: 'Amsterdam', latitude: 52.3676, longitude: 4.9041 },
  BE: { name: 'Belgium', capital: 'Brussels', latitude: 50.8503, longitude: 4.3517 },
  CH: { name: 'Switzerland', capital: 'Bern', latitude: 46.948, longitude: 7.4474 },
  SE: { name: 'Sweden', capital: 'Stockholm', latitude: 59.3293, longitude: 18.0686 },
  NO: { name: 'Norway', capital: 'Oslo', latitude: 59.9139, longitude: 10.7522 },
  DK: { name: 'Denmark', capital: 'Copenhagen', latitude: 55.6761, longitude: 12.5683 },
  FI: { name: 'Finland', capital: 'Helsinki', latitude: 60.1699, longitude: 24.9384 },
  PL: { name: 'Poland', capital: 'Warsaw', latitude: 52.2297, longitude: 21.0122 },
  AT: { name: 'Austria', capital: 'Vienna', latitude: 48.2082, longitude: 16.3738 },
  GR: { name: 'Greece', capital: 'Athens', latitude: 37.9838, longitude: 23.7275 },
  PT: { name: 'Portugal', capital: 'Lisbon', latitude: 38.7223, longitude: -9.1393 },
  IE: { name: 'Ireland', capital: 'Dublin', latitude: 53.3498, longitude: -6.2603 },
  UA: { name: 'Ukraine', capital: 'Kyiv', latitude: 50.4501, longitude: 30.5234 },
  RO: { name: 'Romania', capital: 'Bucharest', latitude: 44.4268, longitude: 26.1025 },
  CZ: { name: 'Czech Republic', capital: 'Prague', latitude: 50.0755, longitude: 14.4378 },
  HU: { name: 'Hungary', capital: 'Budapest', latitude: 47.4979, longitude: 19.0402 },
  IS: { name: 'Iceland', capital: 'Reykjavik', latitude: 64.1466, longitude: -21.9426 },
  RS: { name: 'Serbia', capital: 'Belgrade', latitude: 44.7866, longitude: 20.4489 },
  BG: { name: 'Bulgaria', capital: 'Sofia', latitude: 42.6977, longitude: 23.3219 },
  HR: { name: 'Croatia', capital: 'Zagreb', latitude: 45.815, longitude: 15.9819 },
  SK: { name: 'Slovakia', capital: 'Bratislava', latitude: 48.1486, longitude: 17.1077 },
  SI: { name: 'Slovenia', capital: 'Ljubljana', latitude: 46.0569, longitude: 14.5058 },
  EE: { name: 'Estonia', capital: 'Tallinn', latitude: 59.437, longitude: 24.7536 },
  LV: { name: 'Latvia', capital: 'Riga', latitude: 56.9496, longitude: 24.1052 },
  LT: { name: 'Lithuania', capital: 'Vilnius', latitude: 54.6872, longitude: 25.2797 },
  CY: { name: 'Cyprus', capital: 'Nicosia', latitude: 35.1856, longitude: 33.3823 },
  LU: { name: 'Luxembourg', capital: 'Luxembourg', latitude: 49.6116, longitude: 6.1319 },
  MT: { name: 'Malta', capital: 'Valletta', latitude: 35.8989, longitude: 14.5146 },
  AL: { name: 'Albania', capital: 'Tirana', latitude: 41.3275, longitude: 19.8187 },
  BA: { name: 'Bosnia and Herzegovina', capital: 'Sarajevo', latitude: 43.8563, longitude: 18.4131 },
  ME: { name: 'Montenegro', capital: 'Podgorica', latitude: 42.4304, longitude: 19.2594 },
  MK: { name: 'North Macedonia', capital: 'Skopje', latitude: 41.9981, longitude: 21.4254 },
  MD: { name: 'Moldova', capital: 'Chisinau', latitude: 47.0105, longitude: 28.8638 },
  BY: { name: 'Belarus', capital: 'Minsk', latitude: 53.9006, longitude: 27.559 },

  // Americas
  US: { name: 'United States', capital: 'Washington, D.C.', latitude: 38.8951, longitude: -77.0364 },
  CA: { name: 'Canada', capital: 'Ottawa', latitude: 45.4215, longitude: -75.6972 },
  MX: { name: 'Mexico', capital: 'Mexico City', latitude: 19.4326, longitude: -99.1332 },
  BR: { name: 'Brazil', capital: 'Brasília', latitude: -15.7975, longitude: -47.8919 },
  AR: { name: 'Argentina', capital: 'Buenos Aires', latitude: -34.6037, longitude: -58.3816 },
  CO: { name: 'Colombia', capital: 'Bogota', latitude: 4.711, longitude: -74.0721 },
  CL: { name: 'Chile', capital: 'Santiago', latitude: -33.4489, longitude: -70.6693 },
  PE: { name: 'Peru', capital: 'Lima', latitude: -12.0464, longitude: -77.0428 },
  VE: { name: 'Venezuela', capital: 'Caracas', latitude: 10.4806, longitude: -66.9036 },
  EC: { name: 'Ecuador', capital: 'Quito', latitude: -0.1807, longitude: -78.4678 },
  UY: { name: 'Uruguay', capital: 'Montevideo', latitude: -34.9011, longitude: -56.1645 },
  PY: { name: 'Paraguay', capital: 'Asuncion', latitude: -25.2637, longitude: -57.5759 },
  BO: { name: 'Bolivia', capital: 'Sucre', latitude: -19.0196, longitude: -65.262 },
  CR: { name: 'Costa Rica', capital: 'San Jose', latitude: 9.9281, longitude: -84.0907 },
  PA: { name: 'Panama', capital: 'Panama City', latitude: 8.9824, longitude: -79.5199 },
  CU: { name: 'Cuba', capital: 'Havana', latitude: 23.1136, longitude: -82.3666 },
  DO: { name: 'Dominican Republic', capital: 'Santo Domingo', latitude: 18.4861, longitude: -69.9312 },
  GT: { name: 'Guatemala', capital: 'Guatemala City', latitude: 14.6349, longitude: -90.5069 },
  JM: { name: 'Jamaica', capital: 'Kingston', latitude: 17.9712, longitude: -76.7936 },
  TT: { name: 'Trinidad and Tobago', capital: 'Port of Spain', latitude: 10.6549, longitude: -61.5019 },

  // Africa
  EG: { name: 'Egypt', capital: 'Cairo', latitude: 30.0444, longitude: 31.2357 },
  ZA: { name: 'South Africa', capital: 'Pretoria', latitude: -25.7479, longitude: 28.2293 },
  NG: { name: 'Nigeria', capital: 'Abuja', latitude: 9.0765, longitude: 7.3986 },
  KE: { name: 'Kenya', capital: 'Nairobi', latitude: -1.2921, longitude: 36.8219 },
  MA: { name: 'Morocco', capital: 'Rabat', latitude: 34.0209, longitude: -6.8416 },
  DZ: { name: 'Algeria', capital: 'Algiers', latitude: 36.7538, longitude: 3.0588 },
  TN: { name: 'Tunisia', capital: 'Tunis', latitude: 36.8065, longitude: 10.1815 },
  ET: { name: 'Ethiopia', capital: 'Addis Ababa', latitude: 9.03, longitude: 38.74 },
  GH: { name: 'Ghana', capital: 'Accra', latitude: 5.6037, longitude: -0.187 },
  TZ: { name: 'Tanzania', capital: 'Dodoma', latitude: -6.163, longitude: 35.7516 },
  UG: { name: 'Uganda', capital: 'Kampala', latitude: 0.3476, longitude: 32.5825 },
  SN: { name: 'Senegal', capital: 'Dakar', latitude: 14.7167, longitude: -17.4677 },
  CI: { name: 'Ivory Coast', capital: 'Yamoussoukro', latitude: 6.8276, longitude: -5.2893 },
  CM: { name: 'Cameroon', capital: 'Yaounde', latitude: 3.848, longitude: 11.5021 },
  SD: { name: 'Sudan', capital: 'Khartoum', latitude: 15.5007, longitude: 32.5599 },
  AO: { name: 'Angola', capital: 'Luanda', latitude: -8.839, longitude: 13.2894 },
  MZ: { name: 'Mozambique', capital: 'Maputo', latitude: -25.9692, longitude: 32.5732 },
  ZW: { name: 'Zimbabwe', capital: 'Harare', latitude: -17.8216, longitude: 31.0492 },
  ZM: { name: 'Zambia', capital: 'Lusaka', latitude: -15.3875, longitude: 28.3228 },

  // Oceania
  AU: { name: 'Australia', capital: 'Canberra', latitude: -35.2809, longitude: 149.13 },
  NZ: { name: 'New Zealand', capital: 'Wellington', latitude: -41.2865, longitude: 174.7762 },
  FJ: { name: 'Fiji', capital: 'Suva', latitude: -18.1248, longitude: 178.4501 },
  PG: { name: 'Papua New Guinea', capital: 'Port Moresby', latitude: -9.4438, longitude: 147.1803 },
};

// Build normalized lowercase index for instant name matching
const NAME_TO_CODE = new Map<string, string>();
Object.entries(COUNTRY_CAPITALS).forEach(([code, info]) => {
  NAME_TO_CODE.set(code.toLowerCase(), code);
  NAME_TO_CODE.set(info.name.toLowerCase(), code);
});

// Common country aliases
NAME_TO_CODE.set('usa', 'US');
NAME_TO_CODE.set('united states of america', 'US');
NAME_TO_CODE.set('uk', 'GB');
NAME_TO_CODE.set('great britain', 'GB');
NAME_TO_CODE.set('england', 'GB');
NAME_TO_CODE.set('uae', 'AE');
NAME_TO_CODE.set('russia', 'RU');
NAME_TO_CODE.set('south korea', 'KR');
NAME_TO_CODE.set('czechia', 'CZ');

/**
 * Retrieve capital details for a given country code or name.
 */
export function getCapitalForCountry(countryCode?: string, countryName?: string): CapitalInfo | null {
  if (countryCode) {
    const codeUpper = countryCode.toUpperCase();
    if (COUNTRY_CAPITALS[codeUpper]) {
      return COUNTRY_CAPITALS[codeUpper];
    }
  }

  if (countryName) {
    const trimmed = countryName.trim().toLowerCase();
    const code = NAME_TO_CODE.get(trimmed);
    if (code && COUNTRY_CAPITALS[code]) {
      return COUNTRY_CAPITALS[code];
    }
  }

  return null;
}

/**
 * Check whether a search result from Open-Meteo represents a country/territory rather than a city/town.
 */
export function isCountryResult(featureCode?: string, name?: string, country?: string): boolean {
  if (!featureCode && !name && !country) return false;

  // Open-Meteo/GeoNames country-level codes:
  // PCLI = Independent political entity
  // PCL / PCLD / PCLF / PCLS = Political entity dependencies
  // TERR = Territory
  // CONT = Continent
  if (featureCode) {
    const fc = featureCode.toUpperCase();
    if (fc.startsWith('PCL') || fc === 'TERR' || fc === 'CONT') {
      return true;
    }
    // If it has a populated place code, it is NOT a country
    if (fc.startsWith('PPL')) {
      return false;
    }
  }

  // Name matches country directly and not flagged as populated place
  if (name && country && name.trim().toLowerCase() === country.trim().toLowerCase()) {
    return true;
  }

  // Exact name matches a known country in our dictionary
  if (name && NAME_TO_CODE.has(name.trim().toLowerCase()) && (!featureCode || !featureCode.startsWith('PPL'))) {
    return true;
  }

  return false;
}

/**
 * Priority rank for Open-Meteo search results:
 * Prefers actual populated places (cities, towns, capitals) over countries & large administrative divisions.
 */
export function getFeaturePriority(featureCode?: string): number {
  if (!featureCode) return 50;
  const fc = featureCode.toUpperCase();

  // Country capital (e.g. Tokyo, London, Paris, Islamabad)
  if (fc === 'PPLC') return 100;
  // Major administrative seat / city (e.g. Karachi, Lahore, New York, Sydney)
  if (fc === 'PPLA' || fc === 'PPLA2') return 90;
  // Sub-administrative seat
  if (fc === 'PPLA3' || fc === 'PPLA4') return 80;
  // Populated place (city, town, village)
  if (fc === 'PPL') return 70;
  // Populated place subsection
  if (fc === 'PPLX') return 60;
  // Any other populated place code starting with P
  if (fc.startsWith('P') && !fc.startsWith('PCL')) return 50;

  // Administrative regions (state, province, county)
  if (fc.startsWith('ADM')) return 20;

  // Country-level entity (lowest priority when searching for places)
  if (fc.startsWith('PCL') || fc === 'TERR' || fc === 'CONT') return 5;

  return 30;
}
