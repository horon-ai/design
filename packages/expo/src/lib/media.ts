/**
 * A media-query evaluator for React Native.
 *
 * React Native has no `matchMedia`, but a ported component still asks the same
 * `useMediaQuery("(max-width: 767px)")` questions. This module reads the query
 * syntax the components use and answers it from values React Native does have:
 *
 * - `width` / `min-width` / `max-width` and the `height` family — the window
 *   size from `useWindowDimensions()`, in points (the same numbers react reads
 *   in CSS px).
 * - `orientation` — the window size.
 * - `prefers-color-scheme` — the scheme `useColorScheme()` reports.
 * - `prefers-reduced-motion` — the OS Reduce Motion switch.
 * - `pointer` / `hover` — derived from the OS: a phone or tablet is a coarse
 *   pointer without hover, react-native-web is a fine pointer with hover.
 *
 * Anything else does not match, and an unparsable query reports `false` rather
 * than throwing, so a component that asks an unsupported question draws its
 * default branch.
 */

/** The facts a query is answered from. */
export type MediaSnapshot = {
  /** Window width in points. */
  width: number;
  /** Window height in points. */
  height: number;
  /** The active scheme. */
  scheme: "light" | "dark";
  /** Whether the OS asks for reduced motion. */
  reducedMotion: boolean;
  /** `coarse` on a touch screen, `fine` on react-native-web. */
  pointer: "coarse" | "fine";
  /** Whether a hovering pointer exists; false on a touch screen. */
  hover: boolean;
};

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
 *
 * @param query - The media query string.
 * @returns The conditions in the query, in order; empty when nothing parses.
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
    const value = body
      .slice(colon + 1)
      .trim()
      .toLowerCase();
    if (FEATURE.test(feature) && value !== "") conditions.push({ feature, value });
  }
  return conditions;
}

/** Reads a px length; `undefined` when the value is not a px length. */
function pxValue(value: string): number | undefined {
  const match = /^(-?\d+(?:\.\d+)?)px$/.exec(value);
  return match ? Number(match[1]) : undefined;
}

/** Compares one `width`/`height` condition against the actual size; `false` when the value is unusable. */
function compareSize(actual: number, feature: string, value: string): boolean {
  const bound = pxValue(value);
  if (bound === undefined) return false;
  if (feature === "min-width" || feature === "min-height") return actual >= bound;
  if (feature === "max-width" || feature === "max-height") return actual <= bound;
  return actual === bound;
}

/** True when one condition holds. */
function matchesCondition(condition: Condition, snapshot: MediaSnapshot): boolean {
  switch (condition.feature) {
    case "width":
    case "min-width":
    case "max-width":
      return compareSize(snapshot.width, condition.feature, condition.value);
    case "height":
    case "min-height":
    case "max-height":
      return compareSize(snapshot.height, condition.feature, condition.value);
    case "orientation":
      return condition.value === "portrait"
        ? snapshot.height >= snapshot.width
        : condition.value === "landscape" && snapshot.width > snapshot.height;
    case "prefers-color-scheme":
      return condition.value === snapshot.scheme;
    case "prefers-reduced-motion":
      return condition.value === "reduce"
        ? snapshot.reducedMotion
        : condition.value === "no-preference" && !snapshot.reducedMotion;
    case "pointer":
      return condition.value === snapshot.pointer;
    case "hover":
      return condition.value === "hover" ? snapshot.hover : condition.value === "none" && !snapshot.hover;
    default:
      return false;
  }
}

/**
 * Evaluates one media query string against a snapshot.
 *
 * `and` joins conditions, which must all hold; an empty query, or one with no
 * parsable condition, reports `false`.
 *
 * @param query - A media query such as `(max-width: 767px)`.
 * @param snapshot - The facts to answer from.
 * @returns Whether every condition in the query holds.
 */
export function evaluateMediaQuery(query: string, snapshot: MediaSnapshot): boolean {
  const conditions = parse(query);
  if (conditions.length === 0) return false;
  return conditions.every((condition) => matchesCondition(condition, snapshot));
}
