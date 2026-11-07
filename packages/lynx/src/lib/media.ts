/**
 * A tiny media-query evaluator for Lynx.
 *
 * Lynx has no `matchMedia`, but a ported component still asks the same
 * `useMediaQuery("(max-width: 767px)")` questions. This module reads the query
 * syntax the components actually use and answers it from data Lynx does have:
 *
 * - `width` / `min-width` / `max-width` — `SystemInfo.pixelWidth / pixelRatio`
 *   (CSS px), refreshed by the `onWindowResize` global event.
 * - `prefers-color-scheme` — the provider's scheme.
 * - `prefers-reduced-motion` — the provider's `reducedMotion`.
 * - `pointer: coarse|fine`, `hover: hover|none` — derived from the OS: a phone or
 *   tablet reports a coarse pointer with no hover, a desktop or the browser
 *   engine a fine one.
 *
 * Anything else does not match, and an unparsable query reports `false` rather
 * than throwing, so a component that asks an unsupported question draws its
 * default branch.
 */
import type { Os } from "./platform";

/** The facts a query is answered from. */
export type MediaSnapshot = {
  /** Viewport width in CSS px. */
  width: number;
  /** Viewport height in CSS px. */
  height: number;
  /** The active scheme. */
  scheme: "light" | "dark";
  /** Whether the root asked for reduced motion. */
  reducedMotion: boolean;
  /** The OS the pointer belongs to, which decides the pointer and hover answers. */
  os: Os;
};

/** Viewport size in CSS px from `SystemInfo`; zeros when the engine does not report it. */
export function readViewport(): { width: number; height: number } {
  if (typeof SystemInfo === "undefined") return { width: 0, height: 0 };
  const { pixelWidth, pixelHeight, pixelRatio } = SystemInfo;
  if (typeof pixelWidth !== "number" || typeof pixelHeight !== "number" || typeof pixelRatio !== "number" || pixelRatio <= 0) {
    return { width: 0, height: 0 };
  }
  return { width: pixelWidth / pixelRatio, height: pixelHeight / pixelRatio };
}

/** A phone-shaped OS has a coarse pointer and no hover; everything else is a fine pointer. */
const isTouchOs = (os: Os): boolean => os === "ios" || os === "android";

type Condition = {
  feature: string;
  value: string;
};

/** A feature name such as `max-width` or `prefers-color-scheme`. */
const FEATURE = /^[a-z-]+$/;

/**
 * Splits `(min-width: 768px) and (pointer: fine)` into its conditions.
 *
 * The query is cut at every `)` once and each piece is read from its last `(`,
 * so the work stays linear in the query length. A single regex scan over the
 * whole string restarts at every `(` and backtracks through the rest of an
 * unclosed query, which a crafted query turns into polynomial time.
 */
function parse(query: string): Condition[] {
  const conditions: Condition[] = [];
  // The text after the last `)` is never closed, so it is not a condition.
  for (const piece of query.split(")").slice(0, -1)) {
    const open = piece.lastIndexOf("(");
    if (open === -1) continue;
    const body = piece.slice(open + 1);
    const colon = body.indexOf(":");
    if (colon === -1) continue;
    const feature = body.slice(0, colon).trim().toLowerCase();
    const value = body.slice(colon + 1).trim().toLowerCase();
    if (FEATURE.test(feature) && value !== "") conditions.push({ feature, value });
  }
  return conditions;
}

/** Reads a px length; `undefined` when the value is not a px length. */
function pxValue(value: string): number | undefined {
  const match = /^(-?\d+(?:\.\d+)?)px$/.exec(value);
  return match ? Number(match[1]) : undefined;
}

/** Compares `(max-width: 767px)` style bounds; `null` when the value is unusable. */
function compareWidth(actual: number, condition: string, value: string): boolean | null {
  const bound = pxValue(value);
  if (bound === undefined) return null;
  if (condition === "width") return actual === bound;
  if (condition === "min-width") return actual >= bound;
  if (condition === "max-width") return actual <= bound;
  return null;
}

/** True when one condition holds. */
function matchesCondition(condition: Condition, snapshot: MediaSnapshot): boolean {
  switch (condition.feature) {
    case "width":
    case "min-width":
    case "max-width": {
      const result = compareWidth(snapshot.width, condition.feature, condition.value);
      return result ?? false;
    }
    case "prefers-color-scheme":
      return condition.value === snapshot.scheme;
    case "prefers-reduced-motion":
      return condition.value === "reduce" ? snapshot.reducedMotion : condition.value === "no-preference" && !snapshot.reducedMotion;
    case "pointer":
      return condition.value === "coarse" ? isTouchOs(snapshot.os) : condition.value === "fine" && !isTouchOs(snapshot.os);
    case "hover":
      return condition.value === "none" ? isTouchOs(snapshot.os) : condition.value === "hover" && !isTouchOs(snapshot.os);
    case "orientation":
      return condition.value === "portrait" ? snapshot.height >= snapshot.width : condition.value === "landscape" && snapshot.width > snapshot.height;
    default:
      return false;
  }
}

/**
 * Evaluates one media query string against a snapshot.
 *
 * @param query - A media query such as `(max-width: 767px)`; `and` joins conditions.
 * @param snapshot - The facts to answer from.
 * @returns Whether every condition in the query holds.
 */
export function evaluateMediaQuery(query: string, snapshot: MediaSnapshot): boolean {
  const conditions = parse(query);
  if (conditions.length === 0) return false;
  return conditions.every((condition) => matchesCondition(condition, snapshot));
}
