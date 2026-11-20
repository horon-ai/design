import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * True while the OS asks for reduced motion; false until the first read
 * resolves.
 *
 * React reads `(prefers-reduced-motion: reduce)` synchronously; React Native
 * has no `matchMedia`, so the answer comes from
 * `AccessibilityInfo.isReduceMotionEnabled()` and is kept current with the
 * `reduceMotionChanged` event, which covers the iOS Reduce Motion switch and
 * Android's animation scale. The first render therefore reports `false` and the
 * real value lands a microtask later, where react reports it on the first
 * client pass.
 *
 * The `HoronProvider` reads the same setting for the tree it wraps; this hook
 * reads it directly so a component outside the provider still gets an answer.
 * The provider's `reducedMotion` override is not consulted here.
 *
 * @returns Whether the OS asks for no motion; `false` before the first read.
 *
 * @example
 * ```tsx
 * import { useReducedMotion } from "@horon-ai/expo";
 *
 * function Stream({ text }: { text: string }) {
 *   const reducedMotion = useReducedMotion();
 *   return <HoronText>{reducedMotion ? text : `${text}…`}</HoronText>;
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let live = true;
    const read = async () => {
      try {
        const next = await AccessibilityInfo.isReduceMotionEnabled();
        if (live) setReduced(next);
      } catch {
        // An engine without the query keeps the default `false`.
      }
    };
    void read();
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduced);
    return () => {
      live = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
