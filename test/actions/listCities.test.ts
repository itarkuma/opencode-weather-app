import { describe, test, expect, beforeEach, afterEach, mock } from "bun:test";
import { addCityRecord } from "../../src/storage/citiesStorage.ts";
import { tmpDataFilePath, cleanupTmpFile, captureLogs } from "../setup.ts";

let nextAnswer: string | null = null;

mock.module("../../src/presentation/input.ts", () => ({
  readLine: async () => nextAnswer,
  ask: async () => nextAnswer,
}));

const { selectCity, listCities } = await import(
  "../../src/actions/listCities.ts"
);

describe("selectCity / listCities", () => {
  let tmp = "";
  const ORIG_ENV = process.env["WEATHER_DATA_FILE"];

  beforeEach(async () => {
    tmp = tmpDataFilePath("select");
    process.env["WEATHER_DATA_FILE"] = tmp;
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
  });

  afterEach(async () => {
    await cleanupTmpFile(tmp);
    if (ORIG_ENV === undefined) delete process.env["WEATHER_DATA_FILE"];
    else process.env["WEATHER_DATA_FILE"] = ORIG_ENV;
    nextAnswer = null;
  });

  test("selección válida devuelve la ciudad", async () => {
    nextAnswer = "2";
    const cap = captureLogs();
    try {
      const city = await selectCity("Elegí: ");
      expect(city?.name).toBe("Lima");
    } finally {
      cap.restore();
    }
  });

  test('"0" cancela con null', async () => {
    nextAnswer = "0";
    const cap = captureLogs();
    try {
      expect(await selectCity("Elegí: ")).toBeNull();
    } finally {
      cap.restore();
    }
  });

  test("opción inválida devuelve null", async () => {
    nextAnswer = "99";
    const cap = captureLogs();
    try {
      expect(await selectCity("Elegí: ")).toBeNull();
    } finally {
      cap.restore();
    }
  });

  test("listCities no rompe con ciudades cargadas", async () => {
    const cap = captureLogs();
    try {
      await listCities();
      const out = cap.lines.join("\n");
      expect(out).toContain("Ottawa");
      expect(out).toContain("Lima");
    } finally {
      cap.restore();
    }
  });
});
