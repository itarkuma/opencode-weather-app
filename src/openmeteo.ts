import type { City, Unit } from "./storage.ts";

export interface GeoCandidate {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  apparent: number;
  humidity: number;
  wind: number;
  code: number;
  time: string;
}

const GEO_BASE = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";

export async function searchCities(query: string): Promise<GeoCandidate[]> {
  const url =
    `${GEO_BASE}?name=${encodeURIComponent(query)}&count=5&language=es&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding HTTP ${res.status}`);
  const data = (await res.json()) as { results?: GeoCandidate[] };
  return data.results ?? [];
}

export async function getCurrentWeather(
  city: City,
  unit: Unit,
): Promise<CurrentWeather> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m",
    temperature_unit: unit,
    timezone: "auto",
  });
  const res = await fetch(`${FORECAST_BASE}?${params}`);
  if (!res.ok) throw new Error(`Forecast HTTP ${res.status}`);
  const data = (await res.json()) as {
    current?: {
      temperature_2m: number;
      apparent_temperature: number;
      relative_humidity_2m: number;
      weather_code: number;
      wind_speed_10m: number;
      time: string;
    };
  };
  if (!data.current) throw new Error("Respuesta sin datos actuales");
  return {
    temperature: data.current.temperature_2m,
    apparent: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    wind: data.current.wind_speed_10m,
    code: data.current.weather_code,
    time: data.current.time,
  };
}

export function weatherCodeLabel(code: number): string {
  if (code === 0) return "Despejado";
  if (code === 1) return "Mayormente despejado";
  if (code === 2) return "Parcialmente nublado";
  if (code === 3) return "Cubierto";
  if (code === 45 || code === 48) return "Niebla";
  if (code >= 51 && code <= 57) return "Llovizna";
  if (code >= 61 && code <= 67) return "Lluvia";
  if (code >= 71 && code <= 77) return "Nieve";
  if (code >= 80 && code <= 82) return "Chubascos";
  if (code >= 95 && code <= 99) return "Tormenta";
  return "Desconocido";
}

export function unitSymbol(unit: Unit): string {
  return unit === "celsius" ? "°C" : "°F";
}
