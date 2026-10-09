import { describe, test, expect } from "bun:test";
import {
  cityKey,
  unitSymbol,
  weatherCodeLabel,
  formatDay,
} from "../../src/utils/format.ts";

describe("cityKey", () => {
  test("incluye país cuando existe", () => {
    expect(
      cityKey({ name: "Ottawa", country: "Canadá", latitude: 1, longitude: 2 }),
    ).toBe("Ottawa, Canadá");
  });

  test("solo nombre cuando no hay país", () => {
    expect(cityKey({ name: "Lima", latitude: 1, longitude: 2 })).toBe("Lima");
  });
});

describe("unitSymbol", () => {
  test("celsius → °C", () => {
    expect(unitSymbol("celsius")).toBe("°C");
  });

  test("fahrenheit → °F", () => {
    expect(unitSymbol("fahrenheit")).toBe("°F");
  });
});

describe("weatherCodeLabel", () => {
  const cases: Array<[number, string]> = [
    [0, "Despejado"],
    [1, "Mayormente despejado"],
    [2, "Parcialmente nublado"],
    [3, "Cubierto"],
    [45, "Niebla"],
    [48, "Niebla"],
    [51, "Llovizna"],
    [57, "Llovizna"],
    [61, "Lluvia"],
    [67, "Lluvia"],
    [71, "Nieve"],
    [77, "Nieve"],
    [80, "Chubascos"],
    [82, "Chubascos"],
    [95, "Tormenta"],
    [99, "Tormenta"],
    [100, "Desconocido"],
    [-1, "Desconocido"],
  ];

  for (const [code, label] of cases) {
    test(`code ${code} → ${label}`, () => {
      expect(weatherCodeLabel(code)).toBe(label);
    });
  }
});

describe("formatDay", () => {
  test("no corre el día por zona local y varía por fecha", () => {
    const a = formatDay("2026-10-08");
    const b = formatDay("2026-10-09");
    expect(a.length).toBeGreaterThan(0);
    expect(b.length).toBeGreaterThan(0);
    expect(a).not.toBe(b);
    // Debe contener día y mes numéricos en algún orden
    expect(a).toMatch(/08/);
    expect(a).toMatch(/10/);
  });
});
