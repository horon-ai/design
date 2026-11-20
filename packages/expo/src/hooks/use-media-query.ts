import { useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { evaluateMediaQuery, type MediaSnapshot } from "../lib/media";
import { useColorScheme } from "./use-color-scheme";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Tracks one media query, answered from React Native values instead of
 * `matchMedia`.
 *
 * Width and height come from `useWindowDimensions()`, so a rotation or a split
 * view re-renders and re-evaluates the query; the scheme comes from
 * {@link useColorScheme} and reduced motion from {@link useReducedMotion}.
 * Pointer and hover follow the platform: iOS and Android are a coarse pointer
 * with no hover, every other platform is a fine one with hover.
 *
 * The first render already reports the real value, because the window size is
 * available synchronously; `serverValue` is kept for signature parity with
 * react and is used only when the host reports no width at all.
 *
 * @param query - A media query such as `(max-width: 767px)` or `(prefers-reduced-motion: reduce)`.
 * @param serverValue - Result to report when the host exposes no window size. @default false
 * @returns Whether the query currently matches.
 *
 * @example
 * ```tsx
 * import { useMediaQuery } from "@horon-ai/expo";
 *
 * function Nav() {
 *   const compact = useMediaQuery("(max-width: 767px)");
 *   return compact ? <TabBar items={items} value={tab} onValueChange={setTab} /> : <Sidebar items={items} />;
 * }
 * ```
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const { width, height } = useWindowDimensions();
  const scheme = useColorScheme();
  const reducedMotion = useReducedMotion();
  const touch = Platform.OS === "ios" || Platform.OS === "android";

  const snapshot = useMemo<MediaSnapshot>(
    () => ({
      width,
      height,
      scheme,
      reducedMotion,
      pointer: touch ? "coarse" : "fine",
      hover: !touch,
    }),
    [width, height, scheme, reducedMotion, touch],
  );

  if (width === 0) return serverValue;
  return evaluateMediaQuery(query, snapshot);
}
