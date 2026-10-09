export const BAR = "════════════════════════════════════════";

export const DATA_FILE = "./weather-data.json";

export function getDataFile(): string {
  return process.env["WEATHER_DATA_FILE"] ?? DATA_FILE;
}

export const GEO_BASE = "https://geocoding-api.open-meteo.com/v1/search";

export const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";
