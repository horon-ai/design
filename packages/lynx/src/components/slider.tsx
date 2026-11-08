import { useState } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { cn } from "../lib/cn";

/** The thumb's diameter in CSS px, the Figma 18px knob. */
const THUMB = 18;

/** Half the thumb, the distance its centre sits from its own left edge, in CSS px. */
const HALF_THUMB = THUMB / 2;

/** The axis a slider travels along, the same union as {@link SliderRangeProps.orientation}. */
type Orientation = "horizontal" | "vertical";

/** The shape a Lynx touch event has; only the page position on the slider's axis is read. */
type TouchLike = { detail?: { x?: number; y?: number } };

/**
 * The first finger's page position on the slider's axis, or `undefined` when the event carries no
 * position. A horizontal slider reads `x` and a vertical one reads `y`, so a drag that only reports
 * the axis it uses still works.
 */
const touchAt = (event: TouchLike, orientation: Orientation): number | undefined => {
  const page = orientation === "vertical" ? event.detail?.y : event.detail?.x;
  return typeof page === "number" ? page : undefined;
};

/** The shape a Lynx layout change event has; only the box is read. */
type LayoutLike = {
  detail?: { left?: number; top?: number; width?: number; height?: number };
  params?: { left?: number; top?: number; width?: number; height?: number };
};

/** The control's box on the page, measured by `bindlayoutchange`; all values in CSS px. */
type ControlBox = { left: number; top: number; width: number; height: number };

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
  /**
   * The locale `Intl.NumberFormat` uses when the thumb's spoken value is formatted.
   * Defaults to the runtime locale, and is ignored on an engine without `Intl`.
   */
  locale?: Intl.LocalesArgument;
  /**
   * Options for `Intl.NumberFormat` applied to the thumb's spoken value, for example
   * `{ style: "percent" }` or `{ maximumFractionDigits: 1 }`. Without it the thumb speaks the
   * plain snapped number.
   */
  format?: Intl.NumberFormatOptions;
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
 * `onValueChange`, `min`, `max`, `step`, `locale`, `format`, `disabled`, `orientation`)
 * plus the overrides below. React dropped the root element members `"className"` and
 * `"children"`; Lynx re-declares `className` and takes no children at all.
 */
export type SliderProps = Omit<SliderRangeProps, "className" | "children"> & {
  /** Extra classes for the root, which is 220px wide (`w-[220px]`) and caps at its container by default. */
  className?: string;
  /** Inline style, merged onto the slider's own. */
  style?: CSSProperties;
  /** Accessible name of the thumb, the only focusable part of the control in React; here it names the whole row. */
  "aria-label"?: string;
};

/**
 * A number through `Intl.NumberFormat`, or `fallback` when the engine has no `Intl` (Lynx's native
 * JS engine often does not). The caller passes the plain number as the fallback so an unformatted
 * thumb still reads as its value.
 */
const formatNumber = (
  value: number,
  locale: Intl.LocalesArgument | undefined,
  options: Intl.NumberFormatOptions,
  fallback: string,
): string => {
  if (typeof Intl === "undefined" || typeof Intl.NumberFormat !== "function") return fallback;
  return new Intl.NumberFormat(locale, options).format(value);
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
 * events and one measurement: `bindlayoutchange` on the control reports where the row (horizontal)
 * or column (vertical) sits and how big it is, and every `touchstart`/`touchmove` position is
 * converted to a share of that length — `pageX` across the width, `pageY` up the height. A touch
 * anywhere on the control jumps the thumb there, then the same handler keeps tracking the finger
 * until `touchend`, which is how Base UI's press-and-drag reads on a touch screen. On the vertical
 * axis the range grows upward, so the top of the column is `max`. The thumb is focusable and
 * named, and a disabled slider dims to 40% and ignores touches.
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
  style,
  "aria-label": ariaLabel,
  defaultValue,
  value,
  onValueChange,
  onValueCommitted,
  min = 0,
  max = 100,
  step = 1,
  locale,
  format,
  disabled = false,
  orientation = "horizontal",
  thumbAlignment = "center",
  id,
}: SliderProps) {
  const [own, setOwn] = useState(defaultValue ?? min);
  const current = snap(value ?? own, min, max, step);
  // The control's box and the drag flag are state, not refs: a Lynx layout report arrives once per
  // layout, and a drag is a handful of touch events, so the re-render is the cheap side of the deal
  // and it keeps the handlers reading values from the same render they were created in.
  const [box, setBox] = useState<ControlBox>({ left: 0, top: 0, width: 0, height: 0 });
  const [dragging, setDragging] = useState(false);
  // The axis decides which side of the box is the travel length: the width of the row, or the
  // height of the column. A vertical control is only 6px wide, so reading the width there would
  // leave a few pixels of travel and a drag would never move the thumb.
  const vertical = orientation === "vertical";
  const measured = vertical ? box.height : box.width;

  const span = max - min;
  const share = span > 0 ? Math.min(1, Math.max(0, (current - min) / span)) : 0;
  // `center` moves the thumb's centre along the full measured length; `edge` keeps the whole thumb
  // inside, so it travels the length minus its own diameter.
  const travel = thumbAlignment === "edge" ? Math.max(0, measured - THUMB) : measured;
  // The thumb's inset from the track's start edge (left for a row, bottom for a column), and how far
  // the ink fill reaches: the fill always ends under the thumb's centre, which is the position
  // itself on `center` and half a thumb in on `edge`.
  const offset = share * travel - (thumbAlignment === "edge" ? 0 : HALF_THUMB);
  const fill = share * travel + (thumbAlignment === "edge" ? HALF_THUMB : 0);

  /** Measures the control so a touch position can be read as a share of it. */
  const onLayout = (event: LayoutLike) => {
    const detail = event.detail ?? event.params ?? {};
    const next: ControlBox = {
      left: typeof detail.left === "number" ? detail.left : 0,
      top: typeof detail.top === "number" ? detail.top : 0,
      width: typeof detail.width === "number" ? detail.width : 0,
      height: typeof detail.height === "number" ? detail.height : 0,
    };
    setBox((previous) =>
      previous.left === next.left &&
      previous.top === next.top &&
      previous.width === next.width &&
      previous.height === next.height
        ? previous
        : next,
    );
  };

  /** Turns a page-space position on the slider's axis into a value and reports it. */
  const applyAt = (page: number, commit: boolean) => {
    if (measured <= 0) return;
    // A row grows to the right, so the page x maps straight onto the travel; a column grows
    // upward, so the distance from the control's bottom edge is what the value follows.
    const along = vertical ? box.top + box.height - page : page - box.left;
    const local = along - (thumbAlignment === "edge" ? HALF_THUMB : 0);
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
    const page = touchAt(event, orientation);
    if (page === undefined) return;
    setDragging(true);
    applyAt(page, false);
  };

  const onMove = (event: TouchLike) => {
    if (disabled || !dragging) return;
    const page = touchAt(event, orientation);
    if (page === undefined) return;
    applyAt(page, false);
  };

  const onEnd = () => {
    if (!dragging) return;
    setDragging(false);
    onValueCommitted?.(current);
  };

  return (
    <view
      className={cn("relative flex w-[220px] max-w-full flex-row", vertical && "h-[220px] w-auto flex-col", className)}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      <view
        className={cn(
          "flex w-full flex-row items-center",
          disabled && "opacity-40",
          // A vertical control is a column whose height is the travel; it keeps a 30px wide hit area
          // around the 6px track so the thumb can actually be grabbed, as Base UI's own vertical
          // example pads the control on the cross axis.
          vertical && "h-full w-[30px] flex-col items-center",
        )}
        style={{ height: vertical ? undefined : "20px" }}
        bindlayoutchange={onLayout}
        bindtouchstart={onStart}
        bindtouchmove={onMove}
        bindtouchend={onEnd}
        bindtouchcancel={onEnd}
        accessibility-element
        accessibility-role-description="adjustable"
        accessibility-traits={disabled ? "disabled" : "adjustable"}
        accessibility-label={ariaLabel}
        accessibility-value={format ? formatNumber(current, locale, format, String(current)) : String(current)}
      >
        <view
          className={cn("relative rounded-full bg-overlay-ink-8", vertical ? "h-full w-1.5" : "h-1.5 w-full")}
        >
          <view
            className={cn("absolute rounded-full bg-interactive-primary", vertical ? "bottom-0 left-0 w-full" : "left-0 top-0 h-full")}
            style={vertical ? { height: `${fill}px` } : { width: `${fill}px` }}
          />
          <view
            className="absolute rounded-full border border-border-default bg-bg-default shadow-[0_1px_3px_#0000001f] active:scale-110"
            style={{
              width: `${THUMB}px`,
              height: `${THUMB}px`,
              ...(vertical
                ? { bottom: `${offset}px`, left: `${(6 - THUMB) / 2}px` }
                : { left: `${offset}px`, top: `${(6 - THUMB) / 2}px` }),
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
