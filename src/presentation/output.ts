import type { City } from "../types/City.ts";
import type {
  CurrentWeather,
  DayForecast,
  GeoCandidate,
} from "../types/Weather.ts";
import { green, red, yellow } from "../utils/colors.ts";
import { cityKey, formatDay, weatherCodeLabel } from "../utils/format.ts";

export function ok(message: string): void {
  console.log(green(message));
}

export function err(message: string): void {
  console.log(red(message));
}

export function printWeather(
  city: City,
  weather: CurrentWeather,
  unit: string,
): void {
  console.log(`\n--- ${cityKey(city)} ---`);
  console.log(`  Estado: ${weatherCodeLabel(weather.code)}`);
  console.log(`  Temperatura: ${yellow(`${weather.temperature}${unit}`)}`);
  console.log(`  Sensación térmica: ${yellow(`${weather.apparent}${unit}`)}`);
  console.log(`  Humedad: ${weather.humidity}%`);
  console.log(`  Viento: ${weather.wind} km/h`);
  console.log(`  Hora local: ${weather.time}\n`);
}

export function printWeeklyForecast(
  city: City,
  days: DayForecast[],
  unit: string,
): void {
  console.log(`\n--- ${cityKey(city)} · 7 días ---`);
  for (const d of days) {
    console.log(
      `  ${formatDay(d.date)} — ${weatherCodeLabel(d.code)} — ${yellow(`${d.max}${unit}/${d.min}${unit}`)}`,
    );
  }
  console.log();
}

export function printCandidates(candidates: GeoCandidate[]): void {
  candidates.forEach((c, i) => {
    const region = [c.admin1, c.country].filter(Boolean).join(", ");
    console.log(`  ${i + 1}. ${c.name}${region ? ` (${region})` : ""}`);
  });
}

export function printCityList(
  cities: City[],
  defaultCity: string | null,
): void {
  cities.forEach((c, i) => {
    const mark = defaultCity === c.name ? " *" : "";
    console.log(`  ${i + 1}. ${cityKey(c)}${mark}`);
  });
}
