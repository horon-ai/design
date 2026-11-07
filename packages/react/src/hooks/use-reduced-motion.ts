import { useMediaQuery } from "./use-media-query";

const QUERY = "(prefers-reduced-motion: reduce)";

/** True while the OS asks for reduced motion; false on the server. */
export function useReducedMotion(): boolean {
  return useMediaQuery(QUERY);
}
