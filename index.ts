import {
  cityKey,
  findCity,
  loadStore,
  saveStore,
  type Store,
} from "./src/storage.ts";
import {
  getCurrentWeather,
  searchCities,
  unitSymbol,
} from "./src/openmeteo.ts";
import {
  ask,
  printCandidates,
  printCityList,
  printWeather,
  renderMenu,
} from "./src/ui.ts";

async function showOne(store: Store, name: string): Promise<void> {
  const city = findCity(store, name);
  if (!city) {
    console.log(`No encontré "${name}" en tu lista.`);
    return;
  }
  try {
    const weather = await getCurrentWeather(city, store.unit);
    printWeather(city, weather, unitSymbol(store.unit));
  } catch (err) {
    console.log(`No pude obtener el clima: ${(err as Error).message}`);
  }
}

async function handleDefault(store: Store): Promise<void> {
  if (!store.defaultCity) {
    console.log("No hay ciudad default. Usá la opción 5 para establecerla.");
    return;
  }
  await showOne(store, store.defaultCity);
}

async function handleAll(store: Store): Promise<void> {
  if (store.cities.length === 0) {
    console.log("Todavía no hay ciudades. Usá la opción 3 para agregar una.");
    return;
  }
  for (const city of store.cities) {
    await showOne(store, city.name);
  }
}

async function handleAdd(store: Store): Promise<void> {
  const query = await ask("Nombre de la ciudad: ");
  if (query === null || query === "") return;
  let candidates;
  try {
    candidates = await searchCities(query);
  } catch (err) {
    console.log(`Error buscando ciudad: ${(err as Error).message}`);
    return;
  }
  if (candidates.length === 0) {
    console.log(`Sin resultados para "${query}".`);
    return;
  }
  printCandidates(candidates);
  const choice = await ask("Elegí un número (0 cancela): ");
  if (choice === null) return;
  const n = Number(choice);
  if (!Number.isInteger(n) || n < 0 || n > candidates.length) {
    console.log("Opción inválida.");
    return;
  }
  if (n === 0) return;
  const picked = candidates[n - 1]!;
  if (findCity(store, picked.name)) {
    console.log(`"${picked.name}" ya está en tu lista.`);
    return;
  }
  store.cities.push({
    name: picked.name,
    country: picked.country,
    latitude: picked.latitude,
    longitude: picked.longitude,
  });
  await saveStore(store);
  console.log(`Agregada: ${cityKey(store.cities[store.cities.length - 1]!)}`);
}

async function pickFromList(
  store: Store,
  prompt: string,
): Promise<number | null> {
  if (store.cities.length === 0) {
    console.log("Todavía no hay ciudades. Usá la opción 3 para agregar una.");
    return null;
  }
  printCityList(store);
  const choice = await ask(prompt);
  if (choice === null || choice === "0") return null;
  const n = Number(choice);
  if (!Number.isInteger(n) || n < 1 || n > store.cities.length) {
    console.log("Opción inválida.");
    return null;
  }
  return n - 1;
}

async function handleRemove(store: Store): Promise<void> {
  const idx = await pickFromList(store, "Número a eliminar (0 cancela): ");
  if (idx === null) return;
  const [removed] = store.cities.splice(idx, 1);
  if (removed && store.defaultCity === removed.name) store.defaultCity = null;
  await saveStore(store);
  console.log(`Eliminada: ${removed ? cityKey(removed) : ""}`);
}

async function handleSetDefault(store: Store): Promise<void> {
  const idx = await pickFromList(store, "Número de la default: ");
  if (idx === null) return;
  store.defaultCity = store.cities[idx]!.name;
  await saveStore(store);
  console.log(`Default: ${cityKey(store.cities[idx]!)}`);
}

async function handleSettings(store: Store): Promise<void> {
  store.unit = store.unit === "celsius" ? "fahrenheit" : "celsius";
  await saveStore(store);
  console.log(`Unidad actual: ${unitSymbol(store.unit)}`);
}

async function main(): Promise<void> {
  const store = await loadStore();
  for (;;) {
    renderMenu(store);
    const option = await ask("  Selecciona una opción: ");
    if (option === null) {
      console.log("¡Chau!");
      return;
    }
    switch (option) {
      case "1":
        await handleDefault(store);
        break;
      case "2":
        await handleAll(store);
        break;
      case "3":
        await handleAdd(store);
        break;
      case "4":
        await handleRemove(store);
        break;
      case "5":
        await handleSetDefault(store);
        break;
      case "8":
        await handleSettings(store);
        break;
      case "9":
        console.log("¡Chau!");
        return;
      default:
        console.log("Opción inválida. Elegí 1, 2, 3, 4, 5, 8 o 9.");
    }
  }
}

await main();
