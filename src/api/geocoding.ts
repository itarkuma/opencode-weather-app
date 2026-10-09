import { GEO_BASE } from "../utils/constants.ts";
import type { GeoCandidate } from "../types/Weather.ts";

export async function searchCities(query: string): Promise<GeoCandidate[]> {
  const url =
    `${GEO_BASE}?name=${encodeURIComponent(query)}&count=5&language=es&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding HTTP ${res.status}`);
  const data = (await res.json()) as { results?: GeoCandidate[] };
  return data.results ?? [];
}
