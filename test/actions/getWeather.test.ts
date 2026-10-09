import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { addCityRecord } from "../../src/storage/citiesStorage.ts";
import { setDefaultCity } from "../../src/storage/settingsStorage.ts";
import {
  showDefaultWeather,
  showAllWeather,
} from "../../src/actions/getWeather.ts";
import {
  tmpDataFilePath,
  cleanupTmpFile,
  captureLogs,
  jsonResponse,
} from "../setup.ts";

const fakeCurrent = {
  current: {
    temperature_2m: 20,
    apparent_temperature: 19,
    relative_humidity_2m: 55,
    weather_code: 0,
    wind_speed_10m: 10,
    time: "2026-10-08T12:00",
  },
};

describe("getWeather actions", () => {
  let tmp = "";
  const ORIG_ENV = process.env["WEATHER_DATA_FILE"];
  const origFetch = global.fetch;

  beforeEach(async () => {
    tmp = tmpDataFilePath("weather-actions");
    process.env["WEATHER_DATA_FILE"] = tmp;
    global.fetch = (async () => jsonResponse(fakeCurrent)) as unknown as typeof fetch;
  });

  afterEach(async () => {
    global.fetch = origFetch;
    await cleanupTmpFile(tmp);
    if (ORIG_ENV === undefined) delete process.env["WEATHER_DATA_FILE"];
    else process.env["WEATHER_DATA_FILE"] = ORIG_ENV;
  });

  test("showDefaultWeather avisa cuando no hay default", async () => {
    const cap = captureLogs();
    try {
      await showDefaultWeather();
      expect(cap.lines.join("\n")).toContain("No hay ciudad default");
    } finally {
      cap.restore();
    }
  });

  test("showDefaultWeather muestra el clima de la default", async () => {
    await addCityRecord({
      name: "Ottawa",
      country: "Canadá",
      latitude: 45.41,
      longitude: -75.69,
    });
    await setDefaultCity("Ottawa");
    const cap = captureLogs();
    try {
      await showDefaultWeather();
      const out = cap.lines.join("\n");
      expect(out).toContain("Ottawa");
      expect(out).toContain("20°C");
    } finally {
      cap.restore();
    }
  });

  test("showAllWeather avisa cuando no hay ciudades", async () => {
    const cap = captureLogs();
    try {
      await showAllWeather();
      expect(cap.lines.join("\n")).toContain("Todavía no hay ciudades");
    } finally {
      cap.restore();
    }
  });

  test("showAllWeather muestra todas", async () => {
    await addCityRecord({
      name: "Ottawa",
      country: "Canadá",
      latitude: 45.41,
      longitude: -75.69,
    });
    await addCityRecord({
      name: "Lima",
      country: "Perú",
      latitude: -12.04,
      longitude: -77.04,
    });
    const cap = captureLogs();
    try {
      await showAllWeather();
      const out = cap.lines.join("\n");
      expect(out).toContain("Ottawa");
      expect(out).toContain("Lima");
    } finally {
      cap.restore();
    }
  });

  test("error de fetch no rompe, muestra mensaje", async () => {
    await addCityRecord({
      name: "Ottawa",
      country: "Canadá",
      latitude: 45.41,
      longitude: -75.69,
    });
    await setDefaultCity("Ottawa");
    global.fetch = (async () =>
      new Response("x", { status: 500 })) as unknown as typeof fetch;
    const cap = captureLogs();
    try {
      await showDefaultWeather();
      expect(cap.lines.join("\n")).toContain("No pude obtener el clima");
    } finally {
      cap.restore();
    }
  });
});
