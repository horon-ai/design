import { useHoronTheme } from "../provider";

const QUERY = "prefers-reduced-motion: reduce";

/**
 * True while the tree draws without motion; false by default.
 *
 * Lynx exposes no `matchMedia`, so the answer is the provider's `reducedMotion`
 * prop: the host that knows the OS preference decides, and the
 * `.horon-reduced-motion` root class collapses every duration to match. This is
 * the one behavioral difference from react, where the hook reads the media query
 * itself.
 *
 * @returns Whether the root asked for reduced motion.
 *
 * @example
 * ```tsx
 * import { useReducedMotion } from "@horon-ai/lynx";
 *
 * function Stream({ text }: { text: string }) {
 *   const reducedMotion = useReducedMotion();
 *   return <text className={reducedMotion ? "" : "motion-rise"}>{text}</text>;
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  return useHoronTheme().reducedMotion;
}

/** The query string {@link useReducedMotion} would read on the web, kept for callers that log it. */
export const REDUCED_MOTION_QUERY = QUERY;
