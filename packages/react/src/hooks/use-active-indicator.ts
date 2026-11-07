import { type RefObject, useEffect, useLayoutEffect, useState } from "react";

export type IndicatorRect = { left: number; top: number; width: number; height: number };

/**
 * Measures the active item inside a positioned track so one indicator can slide
 * between items. `selector` finds the active item (for example `[data-pressed]`
 * or `[aria-current="page"]`); the rect follows attribute changes and resizes.
 * `animate` turns true one frame after the first placement, so the indicator
 * lands in place instead of sliding in from 0,0.
 */
export function useActiveIndicator(track: RefObject<HTMLElement | null>, selector: string) {
  const [rect, setRect] = useState<IndicatorRect | null>(null);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const element = track.current;
    if (!element) return undefined;
    const measure = () => {
      const active = element.querySelector<HTMLElement>(selector);
      if (!active) {
        setRect(null);
        return;
      }
      const next = {
        left: active.offsetLeft,
        top: active.offsetTop,
        width: active.offsetWidth,
        height: active.offsetHeight,
      };
      setRect((previous) =>
        previous &&
        previous.left === next.left &&
        previous.top === next.top &&
        previous.width === next.width &&
        previous.height === next.height
          ? previous
          : next,
      );
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    for (const child of Array.from(element.children)) resize.observe(child);
    const mutation = new MutationObserver(measure);
    mutation.observe(element, { attributes: true, subtree: true, childList: true });
    return () => {
      resize.disconnect();
      mutation.disconnect();
    };
  }, [track, selector]);

  useEffect(() => {
    if (!rect || animate) return undefined;
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, [rect, animate]);

  return { rect, animate };
}
