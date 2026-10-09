import type { City, Unit } from "./City.ts";

export interface Store {
  defaultCity: string | null;
  unit: Unit;
  cities: City[];
}
