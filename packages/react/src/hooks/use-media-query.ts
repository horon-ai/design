import { useCallback, useSyncExternalStore } from "react";

const noop = () => {};

/**
 * Tracks one `matchMedia` query. The server render and the first client render
 * use `serverValue`, so static thumbnails and hydration agree before the browser
 * reports the real state.
 *
 * The subscription is rebuilt when `query` changes, and both the server snapshot and the snapshot taken before
 * `window.matchMedia` exists fall back to `serverValue`. The query string must be a literal the caller keeps
 * stable across renders, as the cache key is the string itself.
 *
 * @param query - A media query such as `(max-width: 767px)` or `(prefers-reduced-motion: reduce)`.
 * @param serverValue - Result to report while rendering on the server or before `matchMedia` is available. @default false
 * @returns Whether the query currently matches, or `serverValue` on the server and in the first pass.
 *
 * @example
 * ```tsx
 * import { useMediaQuery } from "@horon-ai/react";
 *
 * function Nav() {
 *   const compact = useMediaQuery("(max-width: 767px)");
 *   return compact ? <TabBar items={items} value={tab} onValueChange={setTab} /> : <Sidebar items={items} />;
 * }
 * ```
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined" || typeof window.matchMedia !== "function") return noop;
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return serverValue;
    return window.matchMedia(query).matches;
  }, [query, serverValue]);
  return useSyncExternalStore(subscribe, getSnapshot, () => serverValue);
}
