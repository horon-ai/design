import { useEffect, useRef, useState } from "@lynx-js/react";

/**
 * Position of the active item inside its track, in CSS px, taken from the item's
 * `layoutchange` readings.
 */
export type IndicatorRect = {
  /** Left offset measured from the track. */
  left: number;
  /** Top offset measured from the track. */
  top: number;
  /** Width of the active item. */
  width: number;
  /** Height of the active item. */
  height: number;
};

/** The measured rect (or `null` before the first measurement) and the handlers that feed it. */
export type ActiveIndicator = {
  /** The active item's box inside the track, or `null` until it has been measured. */
  rect: IndicatorRect | null;
  /** True one frame after the first placement, so the indicator lands instead of sliding in from 0,0. */
  animate: boolean;
  /** Pass as the positioned track's `bindlayoutchange` handler so its own origin is known. */
  bindTrack: (event: LayoutChangeLike) => void;
  /** Spread on item `index`; only the active index's box is kept. */
  bindItem: (index: number) => { bindlayoutchange: (event: LayoutChangeLike) => void };
};

/** The fields of a `layoutchange` event this hook reads; `detail` is what native reports. */
export type LayoutChangeLike = {
  detail?: { left?: number; top?: number; width?: number; height?: number };
  params?: { left?: number; top?: number; width?: number; height?: number };
};

const boxOf = (event: LayoutChangeLike) => {
  const box = event.detail ?? event.params ?? {};
  return {
    left: typeof box.left === "number" ? box.left : 0,
    top: typeof box.top === "number" ? box.top : 0,
    width: typeof box.width === "number" ? box.width : 0,
    height: typeof box.height === "number" ? box.height : 0,
  };
};

/**
 * Measures the active item inside a positioned track so one indicator can slide
 * between items.
 *
 * Lynx has no `offsetLeft`, `ResizeObserver` or `querySelector`, so measurement is
 * push-based: pass `bindTrack` as the track's `bindlayoutchange` and spread `bindItem(index)` on each item,
 * and each `layoutchange` reports that node's box relative to the page. The hook
 * subtracts the track's origin and keeps the active item's box, so the indicator
 * that reads `rect` moves with the real layout instead of a guessed percentage.
 * `animate` turns true one frame after the first placement.
 *
 * Layout events arrive asynchronously, so the first frame draws no indicator
 * (`rect` is `null`); a missing item stays `null` rather than collapsing to 0,0.
 *
 * @param activeIndex - Index of the item the indicator should sit on.
 * @returns The measured rect, the `animate` flag and the two binding helpers.
 *
 * @example
 * ```tsx
 * import { useActiveIndicator } from "@horon-ai/lynx";
 *
 * function Tabs({ items, value }: { items: string[]; value: number }) {
 *   const { rect, animate, bindTrack, bindItem } = useActiveIndicator(value);
 *   return (
 *     <view className="relative flex gap-1" bindlayoutchange={bindTrack}>
 *       {items.map((item, index) => (
 *         <view key={item} {...bindItem(index)}>
 *           <text>{item}</text>
 *         </view>
 *       ))}
 *       <view
 *         className={animate ? "motion-indicator absolute" : "absolute"}
 *         style={{ left: rect?.left ?? 0, top: rect?.top ?? 0, width: rect?.width ?? 0, height: rect?.height ?? 0, opacity: rect ? 1 : 0 }}
 *       />
 *     </view>
 *   );
 * }
 * ```
 */
export function useActiveIndicator(activeIndex: number): ActiveIndicator {
  const [rect, setRect] = useState<IndicatorRect | null>(null);
  const [animate, setAnimate] = useState(false);
  const trackRef = useRef({ left: 0, top: 0 });
  const itemRef = useRef<IndicatorRect | null>(null);

  useEffect(() => {
    if (!rect || animate) return undefined;
    const timer = setTimeout(() => setAnimate(true), 16);
    return () => clearTimeout(timer);
  }, [rect, animate]);

  /** Recomputes the rect whenever either the track or the active item moved. */
  const publish = () => {
    const item = itemRef.current;
    if (!item) {
      setRect(null);
      return;
    }
    const next = {
      left: item.left - trackRef.current.left,
      top: item.top - trackRef.current.top,
      width: item.width,
      height: item.height,
    };
    setRect((previous) =>
      previous && previous.left === next.left && previous.top === next.top && previous.width === next.width && previous.height === next.height ? previous : next,
    );
  };

  const bindTrack = (event: LayoutChangeLike) => {
    const box = boxOf(event);
    trackRef.current = { left: box.left, top: box.top };
    publish();
  };

  const bindItem = (index: number) => ({
    bindlayoutchange: (event: LayoutChangeLike) => {
      if (index !== activeIndex) return;
      itemRef.current = boxOf(event);
      publish();
    },
  });

  return { rect, animate, bindTrack, bindItem };
}
