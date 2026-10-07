import type { City, Store } from "./storage.ts";
import { cityKey } from "./storage.ts";
import { readLine } from "./input.ts";
import {
  unitSymbol,
  weatherCodeLabel,
  type CurrentWeather,
  type GeoCandidate,
} from "./openmeteo.ts";

const BAR = "════════════════════════════════════════";

export function renderMenu(store: Store): void {
  console.log(BAR);
  console.log("         WEATHER CLI");
  console.log(BAR);
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${store.cities.length})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log(`  8. Ajustes (${unitSymbol(store.unit)})`);
  console.log("  9. Salir");
  console.log(BAR);
}

export async function ask(prompt: string): Promise<string | null> {
  return readLine(prompt);
}

export function printWeather(
  city: City,
  weather: CurrentWeather,
  unit: string,
): void {
  console.log(`\n--- ${cityKey(city)} ---`);
  console.log(`  Estado: ${weatherCodeLabel(weather.code)}`);
  console.log(`  Temperatura: ${weather.temperature}${unit}`);
  console.log(`  Sensación térmica: ${weather.apparent}${unit}`);
  console.log(`  Humedad: ${weather.humidity}%`);
  console.log(`  Viento: ${weather.wind} km/h`);
  console.log(`  Hora local: ${weather.time}\n`);
}

export function printCandidates(candidates: GeoCandidate[]): void {
  candidates.forEach((c, i) => {
    const region = [c.admin1, c.country].filter(Boolean).join(", ");
    console.log(`  ${i + 1}. ${c.name}${region ? ` (${region})` : ""}`);
  });
}

export function printCityList(store: Store): void {
  store.cities.forEach((c, i) => {
    const mark = store.defaultCity === c.name ? " *" : "";
    console.log(`  ${i + 1}. ${cityKey(c)}${mark}`);
  });
}
