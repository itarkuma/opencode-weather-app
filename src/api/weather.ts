import { FORECAST_BASE } from "../utils/constants.ts";
import type { City, Unit } from "../types/City.ts";
import type { CurrentWeather, DayForecast } from "../types/Weather.ts";

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

export async function getWeeklyForecast(
  city: City,
  unit: Unit,
): Promise<DayForecast[]> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    forecast_days: "7",
    temperature_unit: unit,
    timezone: "auto",
  });
  const res = await fetch(`${FORECAST_BASE}?${params}`);
  if (!res.ok) throw new Error(`Forecast HTTP ${res.status}`);
  const data = (await res.json()) as {
    daily?: {
      time: string[];
      weather_code: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
    };
  };
  if (!data.daily) throw new Error("Respuesta sin datos diarios");
  return data.daily.time.map((date, i) => ({
    date,
    code: data.daily!.weather_code[i]!,
    max: data.daily!.temperature_2m_max[i]!,
    min: data.daily!.temperature_2m_min[i]!,
  }));
}
