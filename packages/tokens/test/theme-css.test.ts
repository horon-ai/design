import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { buildThemeCss, darkColors, lightColors } from "../src/index";

const themePath = fileURLToPath(new URL("../theme.css", import.meta.url));

describe("@horon-ai/tokens", () => {
  test("committed theme.css matches the generator", () => {
    expect(readFileSync(themePath, "utf8")).toBe(buildThemeCss());
  });

  test("every light color has a dark value", () => {
    expect(Object.keys(darkColors).toSorted()).toEqual(Object.keys(lightColors).toSorted());
  });

  test("colors are hex values from Figma", () => {
    for (const value of [...Object.values(lightColors), ...Object.values(darkColors)]) {
      expect(value).toMatch(/^#[0-9a-f]{6}([0-9a-f]{2})?$/);
    }
  });
});
