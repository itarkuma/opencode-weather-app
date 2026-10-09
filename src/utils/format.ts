import type { City, Unit } from "../types/City.ts";

export function cityKey(city: City): string {
  return `${city.name}${city.country ? `, ${city.country}` : ""}`;
}

export function unitSymbol(unit: Unit): string {
  return unit === "celsius" ? "°C" : "°F";
}

export function weatherCodeLabel(code: number): string {
  if (code === 0) return "Despejado";
  if (code === 1) return "Mayormente despejado";
  if (code === 2) return "Parcialmente nublado";
  if (code === 3) return "Cubierto";
  if (code === 45 || code === 48) return "Niebla";
  if (code >= 51 && code <= 57) return "Llovizna";
  if (code >= 61 && code <= 67) return "Lluvia";
  if (code >= 71 && code <= 77) return "Nieve";
  if (code >= 80 && code <= 82) return "Chubascos";
  if (code >= 95 && code <= 99) return "Tormenta";
  return "Desconocido";
}

const dayFmt = new Intl.DateTimeFormat("es", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
});

export function formatDay(date: string): string {
  // "T12:00:00Z" evita que la zona local corra el día ±1
  return dayFmt.format(new Date(`${date}T12:00:00Z`));
}
