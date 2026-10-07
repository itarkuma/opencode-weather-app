import type { City, Store } from "./storage.ts";
import { cityKey } from "./storage.ts";
import { readLine } from "./input.ts";
import { cyan, yellow } from "./colors.ts";
import {
  unitSymbol,
  weatherCodeLabel,
  type CurrentWeather,
  type GeoCandidate,
} from "./openmeteo.ts";

const BAR = "════════════════════════════════════════";

export function renderMenu(store: Store): void {
  console.log(cyan(BAR));
  console.log(cyan("         WEATHER CLI"));
  console.log(cyan(BAR));
  console.log(`  ${cyan("1")}. Clima de ciudad default`);
  console.log(`  ${cyan("2")}. Clima de todas las ciudades (${store.cities.length})`);
  console.log(`  ${cyan("3")}. Buscar y agregar ciudad`);
  console.log(`  ${cyan("4")}. Eliminar ciudad`);
  console.log(`  ${cyan("5")}. Establecer ciudad default`);
  console.log(`  ${cyan("8")}. Ajustes (${unitSymbol(store.unit)})`);
  console.log(`  ${cyan("9")}. Salir`);
  console.log(cyan(BAR));
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
  console.log(`  Temperatura: ${yellow(`${weather.temperature}${unit}`)}`);
  console.log(`  Sensación térmica: ${yellow(`${weather.apparent}${unit}`)}`);
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
