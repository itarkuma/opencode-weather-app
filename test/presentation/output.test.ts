import { describe, test, expect } from "bun:test";
import {
  printWeather,
  printWeeklyForecast,
  printCandidates,
  printCityList,
} from "../../src/presentation/output.ts";
import { captureLogs } from "../setup.ts";

describe("output", () => {
  test("printWeather muestra ciudad, estado y temperatura", () => {
    const cap = captureLogs();
    try {
      printWeather(
        { name: "Ottawa", country: "Canadá", latitude: 1, longitude: 2 },
        {
          temperature: 20,
          apparent: 19,
          humidity: 55,
          wind: 12,
          code: 0,
          time: "2026-10-08T12:00",
        },
        "°C",
      );
      const out = cap.lines.join("\n");
      expect(out).toContain("Ottawa, Canadá");
      expect(out).toContain("Despejado");
      expect(out).toContain("20°C");
    } finally {
      cap.restore();
    }
  });

  test("printWeeklyForecast lista los días", () => {
    const cap = captureLogs();
    try {
      printWeeklyForecast(
        { name: "Lima", latitude: 1, longitude: 2 },
        [
          { date: "2026-10-08", code: 3, max: 22, min: 12 },
          { date: "2026-10-09", code: 0, max: 23, min: 13 },
        ],
        "°C",
      );
      const out = cap.lines.join("\n");
      expect(out).toContain("7 días");
      expect(out).toContain("22°C/12°C");
    } finally {
      cap.restore();
    }
  });

  test("printCandidates numera candidatos", () => {
    const cap = captureLogs();
    try {
      printCandidates([
        {
          name: "Ottawa",
          country: "Canadá",
          admin1: "Ontario",
          latitude: 1,
          longitude: 2,
        },
      ]);
      expect(cap.lines.join("\n")).toContain("1. Ottawa");
    } finally {
      cap.restore();
    }
  });

  test("printCityList marca la default con *", () => {
    const cap = captureLogs();
    try {
      printCityList(
        [
          { name: "Ottawa", latitude: 1, longitude: 2 },
          { name: "Lima", latitude: 3, longitude: 4 },
        ],
        "Lima",
      );
      const out = cap.lines.join("\n");
      expect(out).toContain("1. Ottawa");
      expect(out).toContain("2. Lima *");
    } finally {
      cap.restore();
    }
  });
});
