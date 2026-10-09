import { getCities } from "../storage/citiesStorage.ts";
import { getDefaultCity } from "../storage/settingsStorage.ts";
import { err, printCityList } from "../presentation/output.ts";
import { ask } from "../presentation/input.ts";
import type { City } from "../types/City.ts";

export async function listCities(): Promise<void> {
  const [cities, defaultCity] = await Promise.all([
    getCities(),
    getDefaultCity(),
  ]);
  if (cities.length === 0) {
    console.log("Todavía no hay ciudades. Usá la opción 3 para agregar una.");
    return;
  }
  printCityList(cities, defaultCity);
}

export async function selectCity(prompt: string): Promise<City | null> {
  const [cities, defaultCity] = await Promise.all([
    getCities(),
    getDefaultCity(),
  ]);
  if (cities.length === 0) {
    console.log("Todavía no hay ciudades. Usá la opción 3 para agregar una.");
    return null;
  }
  printCityList(cities, defaultCity);
  const choice = await ask(prompt);
  if (choice === null || choice === "0") return null;
  const n = Number(choice);
  if (!Number.isInteger(n) || n < 1 || n > cities.length) {
    err("Opción inválida.");
    return null;
  }
  return cities[n - 1]!;
}
