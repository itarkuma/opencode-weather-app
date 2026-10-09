import { getWeeklyForecast } from "../api/weather.ts";
import { getUnit } from "../storage/settingsStorage.ts";
import { unitSymbol } from "../utils/format.ts";
import { err, printWeeklyForecast } from "../presentation/output.ts";
import { selectCity } from "./listCities.ts";

export async function showWeeklyForecast(): Promise<void> {
  const city = await selectCity("Número a pronosticar (0 cancela): ");
  if (!city) return;
  try {
    const unit = await getUnit();
    const days = await getWeeklyForecast(city, unit);
    printWeeklyForecast(city, days, unitSymbol(unit));
  } catch (e) {
    err(`No pude obtener el pronóstico: ${(e as Error).message}`);
  }
}
