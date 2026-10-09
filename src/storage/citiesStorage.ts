import { DATA_FILE } from "../utils/constants.ts";
import type { City } from "../types/City.ts";
import type { Store } from "../types/Store.ts";

function emptyStore(): Store {
  return { defaultCity: null, unit: "celsius", cities: [] };
}

async function load(): Promise<Store> {
  const file = Bun.file(DATA_FILE);
  if (!(await file.exists())) return emptyStore();
  try {
    const raw = (await file.json()) as Partial<Store>;
    return {
      defaultCity: typeof raw.defaultCity === "string" ? raw.defaultCity : null,
      unit: raw.unit === "fahrenheit" ? "fahrenheit" : "celsius",
      cities: Array.isArray(raw.cities) ? (raw.cities as City[]) : [],
    };
  } catch {
    return emptyStore();
  }
}

async function save(store: Store): Promise<void> {
  await Bun.write(DATA_FILE, JSON.stringify(store, null, 2));
}

export async function getCities(): Promise<City[]> {
  return (await load()).cities;
}

export async function findCity(name: string): Promise<City | undefined> {
  return (await load()).cities.find(
    (c) => c.name.toLowerCase() === name.toLowerCase(),
  );
}

export async function addCityRecord(city: City): Promise<void> {
  const store = await load();
  store.cities.push(city);
  await save(store);
}

export async function removeCityRecord(
  name: string,
): Promise<City | undefined> {
  const store = await load();
  const idx = store.cities.findIndex(
    (c) => c.name.toLowerCase() === name.toLowerCase(),
  );
  if (idx === -1) return undefined;
  const [removed] = store.cities.splice(idx, 1);
  await save(store);
  return removed;
}
