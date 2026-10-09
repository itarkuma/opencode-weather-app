import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import {
  getUnit,
  toggleUnit,
  getDefaultCity,
  setDefaultCity,
  clearDefaultCity,
} from "../../src/storage/settingsStorage.ts";
import { tmpDataFilePath, cleanupTmpFile } from "../setup.ts";

describe("settingsStorage", () => {
  let tmp = "";
  const ORIG_ENV = process.env["WEATHER_DATA_FILE"];

  beforeEach(() => {
    tmp = tmpDataFilePath("settings");
    process.env["WEATHER_DATA_FILE"] = tmp;
  });

  afterEach(async () => {
    await cleanupTmpFile(tmp);
    if (ORIG_ENV === undefined) delete process.env["WEATHER_DATA_FILE"];
    else process.env["WEATHER_DATA_FILE"] = ORIG_ENV;
  });

  test("defaults cuando no hay archivo", async () => {
    expect(await getUnit()).toBe("celsius");
    expect(await getDefaultCity()).toBeNull();
  });

  test("toggleUnit alterna y persiste", async () => {
    expect(await toggleUnit()).toBe("fahrenheit");
    expect(await getUnit()).toBe("fahrenheit");
    expect(await toggleUnit()).toBe("celsius");
    expect(await getUnit()).toBe("celsius");
  });

  test("set/get/clear default city", async () => {
    await setDefaultCity("Ottawa");
    expect(await getDefaultCity()).toBe("Ottawa");
    await clearDefaultCity();
    expect(await getDefaultCity()).toBeNull();
  });

  test("unit inválida en disco cae a celsius", async () => {
    await Bun.write(
      tmp,
      JSON.stringify({ defaultCity: null, unit: "kelvin", cities: [] }),
    );
    expect(await getUnit()).toBe("celsius");
  });
});
