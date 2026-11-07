/**
 * Generated-file drift and coverage tests. These are plain `bun test` files: no
 * Lynx runtime is loaded, so the root `bun test` can run them without the
 * ReactLynx toolchain.
 */
import { describe, expect, test } from "bun:test";

import { darkColors, lightColors, primitives, radius, shadow, textStyles } from "@horon-ai/tokens";

import preset from "../tailwind-preset.cjs";
import { buildPreset, buildTokensCss } from "../scripts/generate-tokens";

const pkg = `${import.meta.dir}/..`;
const read = (path: string) => Bun.file(`${pkg}/${path}`).text();

const commitTokenCss = await read("src/styles/tokens.css");
const committedPreset = await read("tailwind-preset.cjs");

const variableValue = (css: string, name: string): string | undefined => new RegExp(`--${name}:\\s*([^;]+);`).exec(css)?.[1]?.trim();

describe("generated token css", () => {
  test("committed tokens.css equals a fresh generation", () => {
    expect(buildTokensCss()).toBe(commitTokenCss);
  });

  test("every light and dark colour token is a CSS variable", () => {
    for (const name of Object.keys(lightColors)) expect(commitTokenCss).toContain(`--color-${name}:`);
    for (const name of Object.keys(darkColors)) expect(commitTokenCss).toContain(`--color-${name}:`);
    for (const name of Object.keys(primitives)) expect(commitTokenCss).toContain(`--color-${name}:`);
  });

  test("keeps one colour variable per token, the same count as react's theme.css", () => {
    // `.horon-glass-blur` re-points the glass tiers at their translucent values, so
    // it is a deliberate second declaration and is counted on its own below.
    const palette = commitTokenCss.replace(/\.horon-glass-blur \{[^}]*\}/, "");
    const declared = [...palette.matchAll(/^\s*--color-[a-z0-9-]+:/gm)].length;
    // Light and the primitives share one block, so the file declares each semantic
    // token once for light and once for dark, plus the primitives once: 91 + 38 + 91.
    expect(declared).toBe(Object.keys(lightColors).length + Object.keys(primitives).length + Object.keys(darkColors).length);
  });

  test("the glass switch re-points exactly the three tiers", () => {
    const block = /\.horon-glass-blur \{([^}]*)\}/.exec(commitTokenCss)?.[1] ?? "";
    const names = [...block.matchAll(/--color-(glass-[a-z-]+):/g)].map((match) => match[1]).toSorted();
    expect(names).toEqual(["glass-clear", "glass-clear-hover", "glass-clear-pressed", "glass-regular", "glass-thick"]);
    for (const name of names) expect(block).toContain(`--color-${name}: var(--glass-tier-`);
  });

  test("radius, shadow, typography and glass/veil variables exist", () => {
    for (const name of Object.keys(radius)) expect(commitTokenCss).toContain(`--radius-${name}:`);
    for (const name of Object.keys(shadow)) expect(commitTokenCss).toContain(`--shadow-${name}:`);
    for (const name of Object.keys(textStyles)) {
      expect(commitTokenCss).toContain(`--text-${name}:`);
      expect(commitTokenCss).toContain(`--text-${name}--line-height:`);
    }
    expect(commitTokenCss).toContain("--glass-rim-top:");
    expect(commitTokenCss).toContain("--glass-rim-mid:");
    expect(commitTokenCss).toContain("--glass-rim-bottom:");
    expect(commitTokenCss).toContain("--veil-field:");
    expect(commitTokenCss).toContain("--veil-overlay:");
  });

  test("ships the three platform typography boards", () => {
    for (const board of ["web", "desktop", "mobile"]) expect(commitTokenCss).toContain(`.horon-platform-${board} {`);
    const desktop = commitTokenCss.slice(commitTokenCss.indexOf(".horon-platform-desktop {"));
    expect(desktop).toContain("--text-display-lg: 48px;");
    const mobile = commitTokenCss.slice(commitTokenCss.indexOf(".horon-platform-mobile {"));
    expect(mobile).toContain("--text-display-lg: 36px;");
  });

  test("resolves every glass tier to the frost degrade", () => {
    for (const tier of ["glass-clear", "glass-regular", "glass-thick"]) {
      expect(variableValue(commitTokenCss, `color-${tier}`)).toBe("var(--color-glass-fill-frost)");
    }
    expect(variableValue(commitTokenCss, "color-glass-fill-frost")).toBe(lightColors["glass-fill-frost"]);
  });
});

describe("generated tailwind preset", () => {
  test("committed tailwind-preset.cjs equals a fresh generation", () => {
    expect(buildPreset()).toBe(committedPreset);
  });

  test("maps every colour token, radius and shadow to its variable", () => {
    const { colors, borderRadius, boxShadow, fontSize } = preset.theme.extend as {
      colors: Record<string, string>;
      borderRadius: Record<string, string>;
      boxShadow: Record<string, string>;
      fontSize: Record<string, [string, Record<string, string>]>;
    };
    for (const name of [...Object.keys(lightColors), ...Object.keys(primitives)]) expect(colors[name]).toBe(`var(--color-${name})`);
    for (const name of Object.keys(radius)) expect(borderRadius[name]).toBe(`var(--radius-${name})`);
    for (const name of Object.keys(shadow)) expect(boxShadow[name]).toBe(`var(--shadow-${name})`);
    for (const name of Object.keys(textStyles)) expect(fontSize[name]?.[0]).toBe(`var(--text-${name})`);
  });

  test("keeps the non-monotonic radius scale", () => {
    const scale = preset.theme.extend.borderRadius;
    expect(variableValue(commitTokenCss, "radius-xl")).toBe("20px");
    expect(variableValue(commitTokenCss, "radius-2xl")).toBe("16px");
    expect(Object.keys(scale)).toEqual(Object.keys(radius));
  });

  test("carries the generated header", () => {
    expect(committedPreset.startsWith("// Generated by scripts/generate-tokens.ts. Do not edit.")).toBe(true);
  });
});

const reactGlobals = await read("../react/src/styles/globals.css");

describe("react parity of the token layer", () => {
  test("lynx globals.css declares every react motion utility and the glass/veil classes", async () => {
    const globals = await read("src/styles/globals.css");
    const utilities = [...reactGlobals.matchAll(/@utility\s+([a-z0-9-]+)/g)].map((match) => match[1]);
    expect(utilities.length).toBeGreaterThan(0);
    for (const name of utilities) expect(globals).toContain(name);
    for (const className of [".liquid-layers", ".veil-field", ".veil-overlay", ".veil-drop"]) {
      expect(reactGlobals).toContain(className);
      expect(globals).toContain(className.replace(".", ""));
    }
  });
});
