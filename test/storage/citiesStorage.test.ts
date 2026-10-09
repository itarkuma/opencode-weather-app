import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import {
  getCities,
  findCity,
  addCityRecord,
  removeCityRecord,
} from "../../src/storage/citiesStorage.ts";
import { tmpDataFilePath, cleanupTmpFile } from "../setup.ts";

describe("citiesStorage", () => {
  let tmp = "";
  const ORIG_ENV = process.env["WEATHER_DATA_FILE"];

  beforeEach(() => {
    tmp = tmpDataFilePath("cities");
    process.env["WEATHER_DATA_FILE"] = tmp;
  });

  afterEach(async () => {
    await cleanupTmpFile(tmp);
    if (ORIG_ENV === undefined) delete process.env["WEATHER_DATA_FILE"];
    else process.env["WEATHER_DATA_FILE"] = ORIG_ENV;
  });

  test("archivo inexistente → lista vacía", async () => {
    expect(await getCities()).toEqual([]);
    expect(await findCity("Ottawa")).toBeUndefined();
  });

  test("JSON corrupto → lista vacía sin romper", async () => {
    await Bun.write(tmp, "esto no es json{{{");
    expect(await getCities()).toEqual([]);
  });

  test("add + find case-insensitive", async () => {
    await addCityRecord({
      name: "Ottawa",
      country: "Canadá",
      latitude: 45.41,
      longitude: -75.69,
    });
    expect(await findCity("ottawa")).toMatchObject({ name: "Ottawa" });
    expect(await findCity("OTTAWA")).toMatchObject({ name: "Ottawa" });
    expect(await getCities()).toHaveLength(1);
  });

  test("remove existente devuelve el registro y lo borra", async () => {
    await addCityRecord({
      name: "Lima",
      country: "Perú",
      latitude: -12,
      longitude: -77,
    });
    const removed = await removeCityRecord("LIMA");
    expect(removed?.name).toBe("Lima");
    expect(await getCities()).toEqual([]);
  });

  test("remove inexistente devuelve undefined", async () => {
    expect(await removeCityRecord("NoExiste")).toBeUndefined();
  });
});
