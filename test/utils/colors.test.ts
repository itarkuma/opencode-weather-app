import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { cyan, yellow, green, red } from "../../src/utils/colors.ts";

const ORIG_NO_COLOR = process.env["NO_COLOR"];

function setTTY(value: boolean): void {
  Object.defineProperty(process.stdout, "isTTY", {
    value,
    configurable: true,
  });
}

describe("colors", () => {
  beforeEach(() => {
    setTTY(false);
    delete process.env["NO_COLOR"];
  });

  afterEach(() => {
    setTTY(false);
    if (ORIG_NO_COLOR === undefined) delete process.env["NO_COLOR"];
    else process.env["NO_COLOR"] = ORIG_NO_COLOR;
  });

  test("sin TTY devuelve texto plano", () => {
    expect(cyan("hola")).toBe("hola");
    expect(yellow("hola")).toBe("hola");
    expect(green("hola")).toBe("hola");
    expect(red("hola")).toBe("hola");
  });

  test("con NO_COLOR devuelve texto plano aunque haya TTY", () => {
    setTTY(true);
    process.env["NO_COLOR"] = "1";
    expect(cyan("hola")).toBe("hola");
    expect(red("hola")).toBe("hola");
  });

  test("con TTY y sin NO_COLOR pinta con ANSI", () => {
    setTTY(true);
    delete process.env["NO_COLOR"];
    expect(cyan("hola")).toContain("\u001b[");
    expect(yellow("hola")).toContain("\u001b[");
    expect(green("hola")).toContain("\u001b[");
    expect(red("hola")).toContain("\u001b[");
  });
});
