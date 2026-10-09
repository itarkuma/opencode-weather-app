import { describe, test, expect, afterEach } from "bun:test";
import { getCurrentWeather, getWeeklyForecast } from "../../src/api/weather.ts";
import { jsonResponse } from "../setup.ts";
import type { City } from "../../src/types/City.ts";

const city: City = {
  name: "Ottawa",
  country: "Canadá",
  latitude: 45.41,
  longitude: -75.69,
};

describe("getCurrentWeather", () => {
  const origFetch = global.fetch;

  afterEach(() => {
    global.fetch = origFetch;
  });

  test("mapea current a CurrentWeather", async () => {
    global.fetch = (async () =>
      jsonResponse({
        current: {
          temperature_2m: 20,
          apparent_temperature: 19,
          relative_humidity_2m: 55,
          weather_code: 2,
          wind_speed_10m: 12,
          time: "2026-10-08T12:00",
        },
      })) as unknown as typeof fetch;

    const out = await getCurrentWeather(city, "celsius");
    expect(out).toEqual({
      temperature: 20,
      apparent: 19,
      humidity: 55,
      wind: 12,
      code: 2,
      time: "2026-10-08T12:00",
    });
  });

  test("lanza si falta current", async () => {
    global.fetch = (async () => jsonResponse({})) as unknown as typeof fetch;
    expect(getCurrentWeather(city, "celsius")).rejects.toThrow(
      "Respuesta sin datos actuales",
    );
  });

  test("lanza si HTTP falla", async () => {
    global.fetch = (async () =>
      new Response("x", { status: 503 })) as unknown as typeof fetch;
    expect(getCurrentWeather(city, "celsius")).rejects.toThrow(
      "Forecast HTTP 503",
    );
  });
});

describe("getWeeklyForecast", () => {
  const origFetch = global.fetch;

  afterEach(() => {
    global.fetch = origFetch;
  });

  test("mapea daily a DayForecast[]", async () => {
    global.fetch = (async () =>
      jsonResponse({
        daily: {
          time: ["2026-10-08", "2026-10-09"],
          weather_code: [1, 3],
          temperature_2m_max: [22, 21],
          temperature_2m_min: [12, 11],
        },
      })) as unknown as typeof fetch;

    const out = await getWeeklyForecast(city, "fahrenheit");
    expect(out).toEqual([
      { date: "2026-10-08", code: 1, max: 22, min: 12 },
      { date: "2026-10-09", code: 3, max: 21, min: 11 },
    ]);
  });

  test("lanza si falta daily", async () => {
    global.fetch = (async () => jsonResponse({})) as unknown as typeof fetch;
    expect(getWeeklyForecast(city, "celsius")).rejects.toThrow(
      "Respuesta sin datos diarios",
    );
  });

  test("lanza si HTTP falla", async () => {
    global.fetch = (async () =>
      new Response("x", { status: 500 })) as unknown as typeof fetch;
    expect(getWeeklyForecast(city, "celsius")).rejects.toThrow(
      "Forecast HTTP 500",
    );
  });
});
