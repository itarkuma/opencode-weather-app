import { describe, test, expect } from "bun:test";
import {
  isMenuOption,
  renderMenu,
  handleOption,
} from "../../src/presentation/menu.ts";
import { captureLogs } from "../setup.ts";

describe("isMenuOption", () => {
  test("acepta opciones válidas", () => {
    for (const o of ["1", "2", "3", "4", "5", "6", "8", "9"]) {
      expect(isMenuOption(o)).toBe(true);
    }
  });

  test("rechaza inválidas", () => {
    for (const o of ["0", "7", "10", "", "a"]) {
      expect(isMenuOption(o)).toBe(false);
    }
  });
});

describe("renderMenu", () => {
  test("muestra conteo y unidad", () => {
    const cap = captureLogs();
    try {
      renderMenu(3, "celsius");
      const out = cap.lines.join("\n");
      expect(out).toContain("WEATHER CLI");
      expect(out).toContain("todas las ciudades (3)");
      expect(out).toContain("°C");
    } finally {
      cap.restore();
    }
  });

  test("muestra °F cuando unit es fahrenheit", () => {
    const cap = captureLogs();
    try {
      renderMenu(0, "fahrenheit");
      expect(cap.lines.join("\n")).toContain("°F");
    } finally {
      cap.restore();
    }
  });
});

describe("handleOption", () => {
  test("opción 9 retorna true (salir)", async () => {
    const cap = captureLogs();
    try {
      const shouldExit = await handleOption("9");
      expect(shouldExit).toBe(true);
      expect(cap.lines.join("\n")).toContain("¡Chau!");
    } finally {
      cap.restore();
    }
  });
});
