import { type RefObject, useEffect, useLayoutEffect, useState } from "react";

/**
 * Position of the active item inside its track, in CSS px, taken from the item's `offset*` readings.
 */
export type IndicatorRect = {
  /** Left offset measured from the track, as `offsetLeft` reports it. */
  left: number;
  /** Top offset measured from the track, as `offsetTop` reports it. */
  top: number;
  /** Width of the active item. */
  width: number;
  /** Height of the active item. */
  height: number;
};

/**
 * Measures the active item inside a positioned track so one indicator can slide
 * between items. `selector` finds the active item (for example `[data-pressed]`
 * or `[aria-current="page"]`); the rect follows attribute changes and resizes.
 * `animate` turns true one frame after the first placement, so the indicator
 * lands in place instead of sliding in from 0,0.
 *
 * Measuring happens in a layout effect, so a server render draws no indicator: `rect` starts `null`, and the
 * first client pass places the item before paint while `animate` stays false.
 *
 * @param track - Ref to the positioned track element that holds the items.
 * @param selector - CSS selector for the active item, queried inside the track; a missing item yields a null rect.
 * @returns The measured rect (or `null` before the first measurement) and an `animate` flag for the first frame.
 *
 * @example
 * ```tsx
 * import { useActiveIndicator } from "@horon-ai/react";
 *
 * function Tabs({ items, value }: { items: string[]; value: string }) {
 *   const track = useRef<HTMLDivElement>(null);
 *   const { rect, animate } = useActiveIndicator(track, '[aria-current="page"]');
 *   return (
 *     <div ref={track} className="relative flex gap-1">
 *       {items.map((item) => (
 *         <button key={item} aria-current={item === value ? "page" : undefined}>
 *           {item}
 *         </button>
 *       ))}
 *       <span
 *         aria-hidden
 *         className={animate ? "pointer-events-none absolute rounded-full motion-indicator" : "pointer-events-none absolute rounded-full"}
 *         style={{ ...rect, opacity: rect ? 1 : 0 }}
 *       />
 *     </div>
 *   );
 * }
 * ```
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
