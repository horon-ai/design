import { useEffect, useMemo, useState } from "@lynx-js/react";

import { evaluateMediaQuery, readViewport, type MediaSnapshot } from "../lib/media";
import { detectOs, readNavigator } from "../lib/platform";
import { useHoronTheme } from "../provider";

/**
 * Tracks one media query.
 *
 * Lynx has no `matchMedia`, so {@link evaluateMediaQuery} answers the query from
 * `SystemInfo` (width), the provider (scheme, reduced motion) and the detected
 * OS (pointer and hover). Width is the only value that can change while the tree
 * is mounted, so the hook subscribes to the `onWindowResize` global event through
 * `lynx.getJSModule("GlobalEventEmitter")` and re-evaluates on each resize.
 *
 * The first render already reports the real value instead of a server fallback,
 * because `SystemInfo` is available synchronously; `serverValue` is kept for
 * signature parity with react and is used only when the engine reports no
 * dimensions at all (a plain Bun test).
 *
 * @param query - A media query such as `(max-width: 767px)` or `(prefers-reduced-motion: reduce)`.
 * @param serverValue - Result to report when the engine exposes no dimensions. @default false
 * @returns Whether the query currently matches.
 *
 * @example
 * ```tsx
 * import { useMediaQuery } from "@horon-ai/lynx";
 *
 * function Nav() {
 *   const compact = useMediaQuery("(max-width: 767px)");
 *   return compact ? <TabBar items={items} value={tab} onValueChange={setTab} /> : <Sidebar items={items} />;
 * }
 * ```
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const theme = useHoronTheme();
  const [viewport, setViewport] = useState(readViewport);

  useEffect(() => {
    if (typeof lynx === "undefined" || typeof lynx.getJSModule !== "function") return undefined;
    const emitter = lynx.getJSModule("GlobalEventEmitter") as
      | { addListener: (name: string, listener: () => void) => void; removeListener: (name: string, listener: () => void) => void }
      | undefined;
    if (!emitter) return undefined;
    const onResize = () => setViewport(readViewport());
    emitter.addListener("onWindowResize", onResize);
    return () => emitter.removeListener("onWindowResize", onResize);
  }, []);

  const snapshot = useMemo<MediaSnapshot>(
    () => ({
      width: viewport.width,
      height: viewport.height,
      scheme: theme.scheme,
      reducedMotion: theme.reducedMotion,
      os: detectOs(readNavigator()),
    }),
    [viewport, theme.scheme, theme.reducedMotion],
  );

  if (viewport.width === 0) return serverValue;
  return evaluateMediaQuery(query, snapshot);
}
