import { useState } from "@lynx-js/react";

import { cn } from "../lib/cn";

/** The thumb's diameter in CSS px, the Figma 18px knob. */
const THUMB = 18;

/** Half the thumb, the distance its centre sits from its own left edge, in CSS px. */
const HALF_THUMB = THUMB / 2;

/** The shape a Lynx touch event has; only the measured x position is read. */
type TouchLike = { detail?: { x?: number } };

/** The first finger's page x, or `undefined` when the event carries no position. */
const touchX = (event: TouchLike): number | undefined => {
  const x = event.detail?.x;
  return typeof x === "number" ? x : undefined;
};

/** The shape a Lynx layout change event has; only the box is read. */
type LayoutLike = { detail?: { left?: number; width?: number }; params?: { left?: number; width?: number } };

/**
 * The range and orientation props of the slider. React took them from Base UI's
 * `Slider.Root`; Lynx has no Base UI, so each one is spelled out here with the same
 * name, meaning and default.
 */
type SliderRangeProps = {
  /** Value at first render when the caller does not own it. @default min */
  defaultValue?: number;
  /** Value the caller owns; passing it makes the slider controlled. */
  value?: number;
  /** Fires with the snapped value while the thumb moves and when the touch lands. */
  onValueChange?: (value: number) => void;
  /** Fires with the snapped value once a drag or a track press ends. */
  onValueCommitted?: (value: number) => void;
  /** The low end of the range. @default 0 */
  min?: number;
  /** The high end of the range. @default 100 */
  max?: number;
  /** The granularity the value snaps to, measured from `min`. @default 1 */
  step?: number;
  /** Blocks interaction and dims the control. @default false */
  disabled?: boolean;
  /**
   * The axis the thumb travels along.
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Where the thumb's own edges sit at the ends of the track. `center` puts the thumb's centre on
   * the end, so it overhangs by its radius; `edge` keeps the whole thumb inside the track.
   * @default "center"
   */
  thumbAlignment?: "center" | "edge";
  /** Form field name. Accepted for call-site parity; Lynx has no form submission. */
  name?: string;
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
};

/**
 * Props of {@link Slider}: every Base UI `Slider.Root` prop (`value`, `defaultValue`,
 * `onValueChange`, `min`, `max`, `step`, `disabled`, `orientation`) plus the two
 * overrides below. React dropped the root element members `"className"` and
 * `"children"`; Lynx re-declares `className` and takes no children at all.
 */
export type SliderProps = Omit<SliderRangeProps, "className" | "children"> & {
  /** Extra classes for the root, which is 220px wide (`w-[220px]`) and caps at its container by default. */
  className?: string;
  /** Accessible name of the thumb, the only focusable part of the control in React; here it names the whole row. */
  "aria-label"?: string;
};

/**
 * Snaps a raw value to the step grid and clamps it to the range. A zero or negative
 * step, or an inverted range, leaves the value where the clamp put it instead of
 * dividing by zero.
 */
const snap = (raw: number, min: number, max: number, step: number): number => {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  const clamped = Math.min(high, Math.max(low, raw));
  if (!Number.isFinite(step) || step <= 0) return clamped;
  const snapped = low + Math.round((clamped - low) / step) * step;
  // Rounding lands on a floating-point neighbour of the grid (0.30000000000000004), so the
  // result is reduced to the step's own precision before it is reported.
  const decimals = (String(step).split(".")[1] ?? "").length;
  return Math.min(high, Math.max(low, Number(snapped.toFixed(decimals))));
};

/**
 * Paper settings slider (Voice / Speed): a 20px control, 6px track at 8% ink with an ink fill,
 * and an 18px white thumb with a 1px hairline and a 0 1 3 12% shadow. Width comes from the caller.
 *
 * Lynx has no pointer capture and no `getBoundingClientRect`, so the drag is built from touch
 * events and one measurement: `bindlayoutchange` on the control reports where the 20px row sits
 * and how wide it is, and every `touchstart`/`touchmove` position is converted to a share of that
 * width. A touch anywhere on the row jumps the thumb there, then the same handler keeps tracking
 * the finger until `touchend`, which is how Base UI's press-and-drag reads on a touch screen.
 * The thumb is focusable and named, and a disabled slider dims to 40% and ignores touches.
 *
 * @example
 * ```tsx
 * import { useState } from "@lynx-js/react";
 * import { Slider } from "@horon-ai/lynx";
 *
 * function VoiceSpeed() {
 *   const [speed, setSpeed] = useState(1);
 *   return (
 *     <Slider
 *       aria-label="Voice speed"
 *       min={0.5}
 *       max={2}
 *       step={0.1}
 *       value={speed}
 *       onValueChange={setSpeed}
 *     />
 *   );
 * }
 * ```
 */
export function Slider({
  className,
  "aria-label": ariaLabel,
  defaultValue,
  value,
  onValueChange,
  onValueCommitted,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  orientation = "horizontal",
  thumbAlignment = "center",
  id,
}: SliderProps) {
  const [own, setOwn] = useState(defaultValue ?? min);
  const current = snap(value ?? own, min, max, step);
  // The row's box and the drag flag are state, not refs: a Lynx layout report arrives once per
  // layout, and a drag is a handful of touch events, so the re-render is the cheap side of the deal
  // and it keeps the handlers reading values from the same render they were created in.
  const [box, setBox] = useState({ left: 0, width: 0 });
  const [dragging, setDragging] = useState(false);
  const measured = box.width;

  const span = max - min;
  const share = span > 0 ? Math.min(1, Math.max(0, (current - min) / span)) : 0;
  // `center` moves the thumb's centre along the full measured width; `edge` keeps the whole thumb
  // inside, so it travels the width minus its own diameter.
  const travel = thumbAlignment === "edge" ? Math.max(0, measured - THUMB) : measured;
  // The thumb's left edge, and how far the ink fill reaches: the fill always ends under the thumb's
  // centre, which is the position itself on `center` and half a thumb in on `edge`.
  const offset = share * travel - (thumbAlignment === "edge" ? 0 : HALF_THUMB);
  const fill = share * travel + (thumbAlignment === "edge" ? HALF_THUMB : 0);

  /** Measures the row so a touch position can be read as a share of it. */
  const onLayout = (event: LayoutLike) => {
    const detail = event.detail ?? event.params ?? {};
    const width = typeof detail.width === "number" ? detail.width : 0;
    const left = typeof detail.left === "number" ? detail.left : 0;
    setBox((previous) => (previous.left === left && previous.width === width ? previous : { left, width }));
  };

  /** Turns a page-space x into a value on the range and reports it. */
  const applyAt = (pageX: number, commit: boolean) => {
    if (box.width <= 0) return;
    const local = pageX - box.left - (thumbAlignment === "edge" ? HALF_THUMB : 0);
    const ratio = travel > 0 ? Math.min(1, Math.max(0, local / travel)) : 0;
    const next = snap(min + ratio * span, min, max, step);
    if (next === current) {
      if (commit) onValueCommitted?.(next);
      return;
    }
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
    if (commit) onValueCommitted?.(next);
  };

  const onStart = (event: TouchLike) => {
    if (disabled) return;
    const x = touchX(event);
    if (x === undefined) return;
    setDragging(true);
    applyAt(x, false);
  };

  const onMove = (event: TouchLike) => {
    if (disabled || !dragging) return;
    const x = touchX(event);
    if (x === undefined) return;
    applyAt(x, false);
  };

  const onEnd = () => {
    if (!dragging) return;
    setDragging(false);
    onValueCommitted?.(current);
  };

  return (
    <view
      className={cn("relative flex w-[220px] max-w-full flex-row", orientation === "vertical" && "h-[220px] w-auto flex-col", className)}
      {...(id === undefined ? {} : { id })}
    >
      <view
        className={cn("flex w-full flex-row items-center", disabled && "opacity-40", orientation === "vertical" && "h-full flex-col justify-center")}
        style={{ height: orientation === "horizontal" ? "20px" : undefined }}
        bindlayoutchange={onLayout}
        bindtouchstart={onStart}
        bindtouchmove={onMove}
        bindtouchend={onEnd}
        bindtouchcancel={onEnd}
        accessibility-element
        accessibility-role-description="adjustable"
        accessibility-traits={disabled ? "disabled" : "adjustable"}
        accessibility-label={ariaLabel}
        accessibility-value={String(current)}
      >
        <view
          className={cn(
            "relative rounded-full bg-overlay-ink-8",
            orientation === "horizontal" ? "h-1.5 w-full" : "h-full w-1.5",
          )}
        >
          <view
            className={cn("absolute rounded-full bg-interactive-primary", orientation === "horizontal" ? "left-0 top-0 h-full" : "bottom-0 left-0 w-full")}
            style={orientation === "horizontal" ? { width: `${fill}px` } : { height: `${fill}px` }}
          />
          <view
            className="absolute rounded-full border border-border-default bg-bg-default shadow-[0_1px_3px_#0000001f] active:scale-110"
            style={{
              width: `${THUMB}px`,
              height: `${THUMB}px`,
              ...(orientation === "horizontal"
                ? { left: `${offset}px`, top: `${(6 - THUMB) / 2}px` }
                : { bottom: `${offset}px`, left: `${(6 - THUMB) / 2}px` }),
              transitionProperty: "transform, box-shadow",
              transitionDuration: "120ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </view>
      </view>
    </view>
  );
}
