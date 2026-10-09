import { describe, test, expect, afterEach } from "bun:test";
import { getDataFile, DATA_FILE } from "../../src/utils/constants.ts";

describe("getDataFile", () => {
  const ORIG = process.env["WEATHER_DATA_FILE"];

  afterEach(() => {
    if (ORIG === undefined) delete process.env["WEATHER_DATA_FILE"];
    else process.env["WEATHER_DATA_FILE"] = ORIG;
  });

  test("usa default cuando no hay env", () => {
    delete process.env["WEATHER_DATA_FILE"];
    expect(getDataFile()).toBe(DATA_FILE);
    expect(getDataFile()).toBe("./weather-data.json");
  });

  test("respeta WEATHER_DATA_FILE para aislar tests", () => {
    process.env["WEATHER_DATA_FILE"] = "/tmp/otro.json";
    expect(getDataFile()).toBe("/tmp/otro.json");
  });
});
