/**
 * Which hosts may refract, and how much work the page will do for them.
 *
 * Refraction needs an SVG filter applied to a backdrop, which only the
 * Chromium family runs: WebKit drops the filter and the blur with it
 * (https://bugs.webkit.org/show_bug.cgi?id=245510) and Gecko never applies one
 * to a backdrop (https://bugzilla.mozilla.org/show_bug.cgi?id=1961378). Every
 * other engine keeps frosted glass, so the answer here decides which surface a
 * host gets, not whether it gets one.
 *
 * Pure functions over a plain environment object on purpose: the browser reads
 * its own environment in `readEnv`, and every rule below can be tested without
 * a window.
 */

import { normalizeShape, type GlassShape } from "./map";

/** What the browser reports about itself, in the shape the rules below read. */
export type RefractionEnv = {
  userAgent: string;
  brands: string[];
  reducedTransparency: boolean;
  coarsePointer: boolean;
};

/** Surfaces that may refract at once: pointers are precise, fingers are not. */
export const MAX_REFRACTING = { fine: 16, coarse: 6 } as const;

/** Largest area in CSS px² that keeps a refraction cheap enough to animate over. */
const FINE_AREA = 600_000;
const COARSE_AREA = 250_000;

const CHROMIUM_BRAND = "Chromium";
const CHROME_UA = /(Chrome|Chromium)\//;
/** iOS browsers are WebKit under another name, and every iPhone browser is WebKit. */
const FOREIGN_UA = /CriOS|EdgiOS|FxiOS|iPhone|iPad/;

/**
 * True when the engine bends a backdrop with an SVG displacement filter.
 * Reduced transparency wins over everything: the reader asked for flat
 * surfaces, so no engine detail applies.
 */
export function engineRefracts(env: RefractionEnv): boolean {
  if (env.reducedTransparency) return false;
  if (env.brands.includes(CHROMIUM_BRAND)) return true;
  if (env.brands.length > 0) return false;
  return CHROME_UA.test(env.userAgent) && !FOREIGN_UA.test(env.userAgent);
}

/** True when a host of this shape is small enough to refract, in CSS px². */
export function areaAllowed(shape: GlassShape, coarsePointer: boolean): boolean {
  const { width, height } = normalizeShape(shape);
  return width * height <= (coarsePointer ? COARSE_AREA : FINE_AREA);
}

type UserAgentBrand = { brand: string };
/** `navigator.userAgentData` is not in the DOM types this package compiles against. */
type UserAgentDataLike = { brands?: UserAgentBrand[] };
type NavigatorWithUserAgentData = Navigator & { userAgentData?: UserAgentDataLike };

const mediaMatches = (query: string): boolean =>
  typeof window === "undefined" || typeof window.matchMedia !== "function" ? false : window.matchMedia(query).matches;

/**
 * Reads the environment of the current page. Outside a browser — during a
 * server render — nothing refracts, which is the same answer every engine
 * before hydration would give.
 */
export function readEnv(): RefractionEnv {
  if (typeof navigator === "undefined") {
    return { userAgent: "", brands: [], reducedTransparency: false, coarsePointer: false };
  }
  const data = (navigator as NavigatorWithUserAgentData).userAgentData;
  return {
    userAgent: navigator.userAgent,
    brands: data?.brands?.map((brand) => brand.brand) ?? [],
    reducedTransparency: mediaMatches("(prefers-reduced-transparency: reduce)"),
    coarsePointer: mediaMatches("(pointer: coarse)"),
  };
}
