import { describe, test, expect, afterEach } from "bun:test";
import { searchCities } from "../../src/api/geocoding.ts";
import { jsonResponse } from "../setup.ts";

describe("searchCities", () => {
  const origFetch = global.fetch;

  afterEach(() => {
    global.fetch = origFetch;
  });

  test("devuelve results cuando la API responde ok", async () => {
    const fake = [
      {
        name: "Ottawa",
        country: "Canadá",
        admin1: "Ontario",
        latitude: 45.41,
        longitude: -75.69,
      },
    ];
    global.fetch = (async () =>
      jsonResponse({ results: fake })) as unknown as typeof fetch;

    const out = await searchCities("Ottawa");
    expect(out).toEqual(fake);
  });

  test("devuelve [] cuando no hay results", async () => {
    global.fetch = (async () => jsonResponse({})) as unknown as typeof fetch;
    expect(await searchCities("XyzInexistente")).toEqual([]);
  });

  test("lanza error cuando HTTP falla", async () => {
    global.fetch = (async () =>
      new Response("boom", { status: 500 })) as unknown as typeof fetch;
    expect(searchCities("Ottawa")).rejects.toThrow("Geocoding HTTP 500");
  });

  test("codifica el query en la URL", async () => {
    let seenUrl = "";
    global.fetch = (async (url: string | URL | Request) => {
      seenUrl = String(url);
      return jsonResponse({ results: [] });
    }) as unknown as typeof fetch;

    await searchCities("San José");
    expect(seenUrl).toContain(`name=${encodeURIComponent("San José")}`);
    expect(seenUrl).toContain("count=5");
    expect(seenUrl).toContain("language=es");
  });
});
