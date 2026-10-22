/**
 * Writes both token artifacts: `theme.css` for the web and `dist/tokens.json`
 * for the Flutter package.
 *
 * `dist/tokens.json` is the contract the Dart token file is generated from
 * (`packages/flutter/scripts/generate-tokens.mjs`), so the web styles and the
 * Flutter tokens come from one source and cannot drift apart unnoticed.
 *
 * Two parts do not come from this package's frozen scales:
 *
 * - `scales.componentRadius` is the radius each component actually renders, not
 *   `radiusRole` (the web map: control 12, card 14, panel 20, pill 9999). A card
 *   really draws `rounded-md` (12) and a dialog or sheet `rounded-lg` (14).
 * - `metrics` holds one-off sizes (button heights, checkbox box, menu width,
 *   sidebar widths) that are not on the 4px space scale.
 *
 * Both are mapped in `packages/flutter/scripts/component-metrics.mjs`, so no
 * value in `src/*.ts` changes.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { oklchToHex } from "../src/color";
import { buildThemeCss } from "../src/css";
import { ACCENT, INK, PALETTE } from "../src/palette";
import {
  breakpoint,
  duration,
  easing,
  fontSize,
  fontWeight,
  glassBlur,
  glassLiquidBlur,
  letterSpacing,
  lineHeight,
  radius,
  shadow,
  space,
  text,
  zIndex,
} from "../src/scales";
import { colorTokens } from "../src/tokens";

type Rgba = { r: number; g: number; b: number; a: number };

type ComponentMetrics = {
  componentRadius: Record<string, number>;
  componentMetrics: Record<string, Record<string, number>>;
  shadowElevation: Record<string, number>;
};

const METRICS_MODULE = "packages/flutter/scripts/component-metrics.mjs";

/** Rebuilds a plain object of numbers, rejecting anything else by name. */
function numberRecord(value: unknown, field: string): Record<string, number> {
  if (typeof value !== "object" || value === null) {
    throw new Error(`@horon-ai/tokens: ${METRICS_MODULE} has no object at \`${field}\``);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => {
      if (typeof entry !== "number") {
        throw new Error(`@horon-ai/tokens: ${METRICS_MODULE} \`${field}.${key}\` is not a number`);
      }
      return [key, entry];
    }),
  );
}

/**
 * Validates the plain-JS mapping module at the package boundary.
 *
 * `component-metrics.mjs` lives outside this package and is untyped, so its
 * shape is checked and rebuilt here rather than asserted.
 */
function asComponentMetrics(value: unknown): ComponentMetrics {
  if (typeof value !== "object" || value === null) {
    throw new Error(`@horon-ai/tokens: ${METRICS_MODULE} did not export an object`);
  }

  const fields = new Map<string, unknown>(Object.entries(value));
  const nested = fields.get("componentMetrics");
  if (typeof nested !== "object" || nested === null) {
    throw new Error(`@horon-ai/tokens: ${METRICS_MODULE} has no object at \`componentMetrics\``);
  }

  return {
    componentRadius: numberRecord(fields.get("componentRadius"), "componentRadius"),
    componentMetrics: Object.fromEntries(
      Object.entries(nested).map(([slug, members]) => [slug, numberRecord(members, `componentMetrics.${slug}`)]),
    ),
    shadowElevation: numberRecord(fields.get("shadowElevation"), "shadowElevation"),
  };
}

const { componentMetrics, componentRadius, shadowElevation } = asComponentMetrics(
  await import(new URL("../../flutter/scripts/component-metrics.mjs", import.meta.url).href),
);

export type ShadowLayer = { offsetX: number; offsetY: number; blur: number; spread: number; color: Rgba };

export type Shadow = { elevation: number; layers: ShadowLayer[] };

export type TokensJson = {
  generatedBy: string;
  colors: { light: Record<string, string>; dark: Record<string, string> };
  palette: Record<string, Record<string, string> | { light: string; dark: string }>;
  scales: {
    space: Record<string, number>;
    radius: Record<string, number>;
    componentRadius: Record<string, number>;
    fontSize: Record<string, number>;
    text: Record<string, number>;
    fontWeight: Record<string, string>;
    lineHeight: Record<string, number>;
    letterSpacing: Record<string, number>;
    duration: Record<string, number>;
    zIndex: Record<string, number>;
    breakpoint: Record<string, number>;
    glassBlur: number;
    glassLiquidBlur: number;
  };
  shadow: Record<string, Shadow>;
  easing: Record<string, [number, number, number, number]>;
  metrics: Record<string, Record<string, number>>;
};

/** The bezier each CSS easing keyword stands for, so both forms agree. */
const CSS_EASING_KEYWORDS: Record<string, [number, number, number, number]> = {
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
  linear: [0, 0, 1, 1],
};

const EASING_KEYS: Record<string, string> = {
  default: "default",
  in: "in",
  out: "out",
  "in-out": "inOut",
  "in-strong": "inStrong",
  "out-strong": "outStrong",
  "out-cubic": "outCubic",
  "out-quint": "outQuint",
  "in-out-strong": "inOutStrong",
};

function parseEasing(value: string): [number, number, number, number] {
  const keyword = CSS_EASING_KEYWORDS[value.trim()];
  if (keyword) return keyword;

  const match = value.trim().match(/^cubic-bezier\(\s*([^)]+?)\s*\)$/);
  if (!match) throw new Error(`@horon-ai/tokens: unsupported easing "${value}"`);
  const points = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
  if (points.length !== 4 || points.some((point) => Number.isNaN(point))) {
    throw new Error(`@horon-ai/tokens: malformed cubic-bezier "${value}"`);
  }
  return [points[0], points[1], points[2], points[3]];
}

function parseRgbFunction(value: string): Rgba {
  const match = value.trim().match(/^rgb\(\s*([^)]+?)\s*\)$/);
  if (!match) throw new Error(`@horon-ai/tokens: unsupported shadow color "${value}"`);

  const [channels, alphaPart] = match[1].split("/");
  const [r, g, b] = channels
    .trim()
    .split(/\s+/)
    .map((part) => Number.parseFloat(part));
  const a = alphaPart ? Number.parseFloat(alphaPart.trim()) : 1;
  if ([r, g, b, a].some((n) => Number.isNaN(n))) {
    throw new Error(`@horon-ai/tokens: malformed shadow color "${value}"`);
  }
  return { r, g, b, a };
}

/** Depth tracking keeps the commas inside `rgb(...)` from splitting layers. */
function splitShadowLayers(value: string): string[] {
  const layers: string[] = [];
  let depth = 0;
  let current = "";

  for (const char of value) {
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (char === "," && depth === 0) {
      layers.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }

  if (current.trim()) layers.push(current.trim());
  return layers;
}

function parseShadow(value: string): ShadowLayer[] {
  return splitShadowLayers(value).map((layer) => {
    const colorMatch = layer.match(/rgb\([^)]*\)/);
    if (!colorMatch || colorMatch.index === undefined) {
      throw new Error(`@horon-ai/tokens: shadow layer without a color "${layer}"`);
    }

    const offsets = layer
      .slice(0, colorMatch.index)
      .trim()
      .split(/\s+/)
      .map((part) => Number.parseFloat(part));
    if (offsets.length < 3) throw new Error(`@horon-ai/tokens: shadow layer without offsets "${layer}"`);

    const [offsetX, offsetY, blur, spread = 0] = offsets;
    return { offsetX, offsetY, blur, spread, color: parseRgbFunction(colorMatch[0]) };
  });
}

function semanticColors(scheme: "light" | "dark"): Record<string, string> {
  return Object.fromEntries(Object.entries(colorTokens[scheme]).map(([name, value]) => [name, oklchToHex(value)]));
}

function paletteJson(): TokensJson["palette"] {
  const ramps = Object.fromEntries(
    Object.entries(PALETTE).map(([ramp, steps]) => [
      ramp,
      Object.fromEntries(Object.entries(steps).map(([step, value]) => [step, oklchToHex(value)])),
    ]),
  );

  return {
    ...ramps,
    ink: { light: oklchToHex(INK.light), dark: oklchToHex(INK.dark) },
    accent: { light: oklchToHex(ACCENT.light), dark: oklchToHex(ACCENT.dark) },
  };
}

/** Pure, so the drift test can build the same JSON in memory. */
export function buildTokensJson(): TokensJson {
  return {
    generatedBy: "design/packages/tokens/scripts/build.ts",
    colors: { light: semanticColors("light"), dark: semanticColors("dark") },
    palette: paletteJson(),
    scales: {
      space,
      radius,
      componentRadius,
      fontSize,
      text,
      fontWeight,
      lineHeight,
      letterSpacing,
      duration,
      zIndex,
      breakpoint,
      glassBlur,
      glassLiquidBlur,
    },
    shadow: Object.fromEntries(
      Object.entries(shadow).map(([name, value]) => [
        name,
        { elevation: shadowElevation[name], layers: parseShadow(value.web) },
      ]),
    ),
    easing: Object.fromEntries(
      Object.entries(easing.web).map(([name, value]) => [EASING_KEYS[name], parseEasing(value)]),
    ),
    metrics: componentMetrics,
  };
}

async function main() {
  const cssPath = fileURLToPath(new URL("../theme.css", import.meta.url));
  const jsonPath = fileURLToPath(new URL("../dist/tokens.json", import.meta.url));

  await writeFile(cssPath, buildThemeCss(), "utf8");
  await mkdir(dirname(jsonPath), { recursive: true });
  await writeFile(jsonPath, `${JSON.stringify(buildTokensJson(), null, 2)}\n`, "utf8");

  console.log(`@horon-ai/tokens -> ${cssPath}`);
  console.log(`@horon-ai/tokens -> ${jsonPath}`);
}

if (import.meta.main) await main();
