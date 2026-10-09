import { setDefaultCity } from "../storage/settingsStorage.ts";
import { cityKey } from "../utils/format.ts";
import { ok } from "../presentation/output.ts";
import { selectCity } from "./listCities.ts";

export async function setDefault(): Promise<void> {
  const city = await selectCity("Número de la default: ");
  if (!city) return;
  await setDefaultCity(city.name);
  ok(`Default: ${cityKey(city)}`);
}
