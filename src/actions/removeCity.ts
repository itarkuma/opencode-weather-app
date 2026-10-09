import { removeCityRecord } from "../storage/citiesStorage.ts";
import {
  clearDefaultCity,
  getDefaultCity,
} from "../storage/settingsStorage.ts";
import { cityKey } from "../utils/format.ts";
import { ok } from "../presentation/output.ts";
import { selectCity } from "./listCities.ts";

export async function removeCity(): Promise<void> {
  const city = await selectCity("Número a eliminar (0 cancela): ");
  if (!city) return;
  const removed = await removeCityRecord(city.name);
  if (removed && (await getDefaultCity()) === removed.name) {
    await clearDefaultCity();
  }
  ok(`Eliminada: ${removed ? cityKey(removed) : ""}`);
}
