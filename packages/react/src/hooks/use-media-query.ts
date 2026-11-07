import { useCallback, useSyncExternalStore } from "react";

const noop = () => {};

/**
 * Tracks one `matchMedia` query. The server render and the first client render
 * use `serverValue`, so static thumbnails and hydration agree before the browser
 * reports the real state.
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
