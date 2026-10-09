import { getCurrentWeather } from "../api/weather.ts";
import { findCity, getCities } from "../storage/citiesStorage.ts";
import { getDefaultCity, getUnit } from "../storage/settingsStorage.ts";
import { unitSymbol } from "../utils/format.ts";
import { err, printWeather } from "../presentation/output.ts";

async function showOne(name: string): Promise<void> {
  const [city, unit] = await Promise.all([findCity(name), getUnit()]);
  if (!city) {
    err(`No encontré "${name}" en tu lista.`);
    return;
  }
  try {
    const weather = await getCurrentWeather(city, unit);
    printWeather(city, weather, unitSymbol(unit));
  } catch (e) {
    err(`No pude obtener el clima: ${(e as Error).message}`);
  }
}

export async function showDefaultWeather(): Promise<void> {
  const defaultCity = await getDefaultCity();
  if (!defaultCity) {
    console.log("No hay ciudad default. Usá la opción 5 para establecerla.");
    return;
  }
  await showOne(defaultCity);
}

export async function showAllWeather(): Promise<void> {
  const cities = await getCities();
  if (cities.length === 0) {
    console.log("Todavía no hay ciudades. Usá la opción 3 para agregar una.");
    return;
  }
  for (const city of cities) {
    await showOne(city.name);
  }
}
