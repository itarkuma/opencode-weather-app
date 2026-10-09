import { DATA_FILE } from "../utils/constants.ts";
import type { Unit } from "../types/City.ts";
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
      cities: Array.isArray(raw.cities) ? raw.cities : [],
    };
  } catch {
    return emptyStore();
  }
}

async function save(store: Store): Promise<void> {
  await Bun.write(DATA_FILE, JSON.stringify(store, null, 2));
}

export async function getUnit(): Promise<Unit> {
  return (await load()).unit;
}

export async function toggleUnit(): Promise<Unit> {
  const store = await load();
  store.unit = store.unit === "celsius" ? "fahrenheit" : "celsius";
  await save(store);
  return store.unit;
}

export async function getDefaultCity(): Promise<string | null> {
  return (await load()).defaultCity;
}

export async function setDefaultCity(name: string): Promise<void> {
  const store = await load();
  store.defaultCity = name;
  await save(store);
}

export async function clearDefaultCity(): Promise<void> {
  const store = await load();
  store.defaultCity = null;
  await save(store);
}
