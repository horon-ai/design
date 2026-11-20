import { useCallback, useEffect, useRef, useState } from "react";
import type { LayoutChangeEvent } from "react-native";

/**
 * Position of the active item inside its track, in points, taken from the item's
 * own `onLayout` reading.
 */
export type IndicatorRect = {
  /** Left offset measured from the track, the item's `layout.x`. */
  left: number;
  /** Top offset measured from the track, the item's `layout.y`. */
  top: number;
  /** Width of the active item. */
  width: number;
  /** Height of the active item. */
  height: number;
};

/** The measured rect (or `null` before the first measurement) and the handler that feeds it. */
export type ActiveIndicator = {
  /** The active item's box inside the track, or `null` until it has been measured. */
  rect: IndicatorRect | null;
  /** True one frame after the first placement, so the indicator lands instead of sliding in from 0,0. */
  animate: boolean;
  /** Spread on item `index`; every item's box is remembered so a selection change can place the indicator. */
  bindItem: (index: number) => { onLayout: (event: LayoutChangeEvent) => void };
};

/**
 * Measures the active item inside a positioned track so one indicator can slide
 * between items.
 *
 * React queries the track with a selector and reads `offsetLeft`/`offsetWidth`;
 * React Native has neither, so measurement is push-based: pass the item index
 * instead of a selector, spread `bindItem(index)` on each item, and every
 * `onLayout` reports that item's box. React Native reports boxes relative to the
 * parent, so the items must be the track's direct children — that is what makes
 * `left`/`top` track-relative without subtracting an origin. Every item's last
 * box is remembered, so changing `activeIndex` places the indicator from that
 * item's earlier reading even though its layout did not change and React Native
 * reports nothing new for it. `animate` turns true one frame after the first
 * placement.
 *
 * Layout events arrive after the first frame, so the first render draws no
 * indicator (`rect` is `null`); a missing item stays `null` rather than
 * collapsing to 0,0.
 *
 * @param activeIndex - Index of the item the indicator should sit on.
 * @returns The measured rect, the `animate` flag and the item binding helper.
 *
 * @example
 * ```tsx
 * import { View } from "react-native";
 * import { useActiveIndicator } from "@horon-ai/expo";
 *
 * function Tabs({ items, value }: { items: string[]; value: number }) {
 *   const { rect, animate, bindItem } = useActiveIndicator(value);
 *   return (
 *     <View style={{ position: "relative", flexDirection: "row", gap: 4 }}>
 *       {items.map((item, index) => (
 *         <View key={item} {...bindItem(index)}>
 *           <HoronText>{item}</HoronText>
 *         </View>
 *       ))}
 *       <View
 *         style={{
 *           position: "absolute",
 *           left: rect?.left ?? 0,
 *           top: rect?.top ?? 0,
 *           width: rect?.width ?? 0,
 *           height: rect?.height ?? 0,
 *           opacity: rect ? 1 : 0,
 *         }}
 *       />
 *     </View>
 *   );
 * }
 * ```
 */
export function useActiveIndicator(activeIndex: number): ActiveIndicator {
  const [rect, setRect] = useState<IndicatorRect | null>(null);
  const [animate, setAnimate] = useState(false);
  // The last box every item reported, keyed by index. An item only reports `onLayout` when
  // its own box changes, so a selection change alone never re-fires it for the newly active item;
  // keeping every box is what lets the effect below place the indicator from a remembered reading.
  const itemsRef = useRef(new Map<number, IndicatorRect>());
  const activeRef = useRef(activeIndex);

  /** Publishes the remembered box of the active item. */
  const publish = useCallback(() => {
    const item = itemsRef.current.get(activeRef.current);
    if (!item) {
      // An item that has never reported stays unplaced, rather than collapsing to the track corner.
      setRect(null);
      return;
    }
    setRect((previous) =>
      previous &&
      previous.left === item.left &&
      previous.top === item.top &&
      previous.width === item.width &&
      previous.height === item.height
        ? previous
        : item,
    );
  }, []);

  // A selection change publishes the newly active item's remembered box, because nothing else
  // fires for it: its own layout did not change, only which item the indicator points at.
  useEffect(() => {
    activeRef.current = activeIndex;
    publish();
  }, [activeIndex, publish]);

  useEffect(() => {
    if (!rect || animate) return undefined;
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, [rect, animate]);

  const bindItem = useCallback(
    (index: number) => ({
      onLayout: (event: LayoutChangeEvent) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        itemsRef.current.set(index, { left: x, top: y, width, height });
        if (index === activeRef.current) publish();
      },
    }),
    [publish],
  );

  return { rect, animate, bindItem };
}
