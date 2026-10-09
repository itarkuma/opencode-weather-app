import type { Unit } from "../types/City.ts";
import type { MenuOption } from "../types/MenuOption.ts";
import { getCities } from "../storage/citiesStorage.ts";
import { getUnit, toggleUnit } from "../storage/settingsStorage.ts";
import { BAR } from "../utils/constants.ts";
import { cyan } from "../utils/colors.ts";
import { unitSymbol } from "../utils/format.ts";
import { ask } from "./input.ts";
import { err, ok } from "./output.ts";
import { showAllWeather, showDefaultWeather } from "../actions/getWeather.ts";
import { showWeeklyForecast } from "../actions/getWeeklyForecast.ts";
import { addCity } from "../actions/addCity.ts";
import { removeCity } from "../actions/removeCity.ts";
import { setDefault } from "../actions/setDefaultCity.ts";

export function isMenuOption(value: string): value is MenuOption {
  return ["1", "2", "3", "4", "5", "6", "8", "9"].includes(value);
}

export async function handleOption(option: MenuOption): Promise<boolean> {
  switch (option) {
    case "1":
      await showDefaultWeather();
      return false;
    case "2":
      await showAllWeather();
      return false;
    case "3":
      await addCity();
      return false;
    case "4":
      await removeCity();
      return false;
    case "5":
      await setDefault();
      return false;
    case "6":
      await showWeeklyForecast();
      return false;
    case "8": {
      const next = await toggleUnit();
      ok(`Unidad actual: ${unitSymbol(next)}`);
      return false;
    }
    case "9":
      console.log("¡Chau!");
      return true;
  }
}

export function renderMenu(count: number, unit: Unit): void {
  console.log(cyan(BAR));
  console.log(cyan("         WEATHER CLI"));
  console.log(cyan(BAR));
  console.log(`  ${cyan("1")}. Clima de ciudad default`);
  console.log(`  ${cyan("2")}. Clima de todas las ciudades (${count})`);
  console.log(`  ${cyan("3")}. Buscar y agregar ciudad`);
  console.log(`  ${cyan("4")}. Eliminar ciudad`);
  console.log(`  ${cyan("5")}. Establecer ciudad default`);
  console.log(`  ${cyan("6")}. Pronóstico 7 días`);
  console.log(`  ${cyan("8")}. Ajustes (${unitSymbol(unit)})`);
  console.log(`  ${cyan("9")}. Salir`);
  console.log(cyan(BAR));
}

export async function runMenu(): Promise<void> {
  for (;;) {
    const [cities, unit] = await Promise.all([getCities(), getUnit()]);
    renderMenu(cities.length, unit);
    const option = await ask("  Selecciona una opción: ");
    if (option === null) {
      console.log("¡Chau!");
      return;
    }
    if (!isMenuOption(option)) {
      err("Opción inválida. Elegí 1, 2, 3, 4, 5, 6, 8 o 9.");
      continue;
    }
    const shouldExit = await handleOption(option);
    if (shouldExit) return;
  }
}
