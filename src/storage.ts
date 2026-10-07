export interface City {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export type Unit = "celsius" | "fahrenheit";

export interface Store {
  defaultCity: string | null;
  unit: Unit;
  cities: City[];
}

const DATA_FILE = "./weather-data.json";

export function emptyStore(): Store {
  return { defaultCity: null, unit: "celsius", cities: [] };
}

export async function loadStore(): Promise<Store> {
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

export async function saveStore(store: Store): Promise<void> {
  await Bun.write(DATA_FILE, JSON.stringify(store, null, 2));
}

export function findCity(store: Store, name: string): City | undefined {
  return store.cities.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

export function cityKey(city: City): string {
  return `${city.name}${city.country ? `, ${city.country}` : ""}`;
}
