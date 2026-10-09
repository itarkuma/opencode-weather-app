import { searchCities } from "../api/geocoding.ts";
import { addCityRecord, findCity } from "../storage/citiesStorage.ts";
import { cityKey } from "../utils/format.ts";
import { ask } from "../presentation/input.ts";
import { err, ok, printCandidates } from "../presentation/output.ts";

export async function addCity(): Promise<void> {
  const query = await ask("Nombre de la ciudad: ");
  if (query === null || query === "") return;
  let candidates;
  try {
    candidates = await searchCities(query);
  } catch (e) {
    err(`Error buscando ciudad: ${(e as Error).message}`);
    return;
  }
  if (candidates.length === 0) {
    err(`Sin resultados para "${query}".`);
    return;
  }
  printCandidates(candidates);
  const choice = await ask("Elegí un número (0 cancela): ");
  if (choice === null) return;
  const n = Number(choice);
  if (!Number.isInteger(n) || n < 0 || n > candidates.length) {
    err("Opción inválida.");
    return;
  }
  if (n === 0) return;
  const picked = candidates[n - 1]!;
  if (await findCity(picked.name)) {
    err(`"${picked.name}" ya está en tu lista.`);
    return;
  }
  await addCityRecord({
    name: picked.name,
    country: picked.country,
    latitude: picked.latitude,
    longitude: picked.longitude,
  });
  ok(`Agregada: ${cityKey({ ...picked })}`);
}
