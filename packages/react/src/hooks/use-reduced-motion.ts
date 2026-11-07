import { useMediaQuery } from "./use-media-query";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * True while the OS asks for reduced motion; false on the server.
 *
 * A thin reading of {@link useMediaQuery} over `(prefers-reduced-motion: reduce)`; the CSS side of the same
 * preference is handled by the motion utilities in `globals.css`, which collapse their durations.
 *
 * @returns Whether the user prefers reduced motion; `false` during a server render and the first pass.
 *
 * @example
 * ```tsx
 * import { useReducedMotion } from "@horon-ai/react";
 *
 * function Stream({ text }: { text: string }) {
 *   const reducedMotion = useReducedMotion();
 *   return <StreamingText text={text} smooth={!reducedMotion} />;
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  return useMediaQuery(QUERY);
}
