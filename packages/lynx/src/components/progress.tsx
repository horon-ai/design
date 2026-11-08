import type { CSSProperties } from "@lynx-js/types";

import { cn } from "../lib/cn";

/**
 * The range and reading props of the bar. Lynx has no Base UI part to pass them through, so they are
 * spelled out here, and the reading pair keeps React's hyphenated names so a ported call site reads
 * the same.
 */
type ProgressRangeProps = {
  /**
   * The value the empty track stands for.
   * @default 0
   */
  min?: number;
  /**
   * The value a full track stands for.
   * @default 100
   */
  max?: number;
  /**
   * The locale `Intl.NumberFormat` uses when formatting the value.
   * Defaults to the runtime locale, and is ignored on an engine without `Intl`.
   */
  locale?: Intl.LocalesArgument;
  /**
   * Options for `Intl.NumberFormat`, for example `{ style: "percent" }` or `{ maximumFractionDigits: 0 }`.
   * Without it the value is formatted as a percentage of the range, which is what the bar speaks and paints.
   */
  format?: Intl.NumberFormatOptions;
  /**
   * Builds the spoken value from the formatted text and the raw value, for example
   * `(_, value) => `${value} of 5 files``. The raw value is `null` when the bar is
   * indeterminate; the formatted text is then an empty string.
   */
  getAriaValueText?: (formattedValue: string, value: number | null) => string;
  /** Accessible name of the bar, read out with the value. */
  "aria-label"?: string;
  /** Overrides the spoken value, for example "3 of 5 files". Wins over {@link getAriaValueText}. */
  "aria-valuetext"?: string;
};

/**
 * Props for {@link Progress}. React omitted `className` and `value` from the Base UI root and declared
 * them itself; Lynx has no such root, so the same two props are omitted from {@link ProgressRangeProps}
 * and declared here. The label stays a separate concern, exactly as in React: this wrapper renders only
 * the bar. `locale`, `format` and `getAriaValueText` configure the value the bar speaks, the same way
 * Base UI's `Progress.Root` does.
 */
export type ProgressProps = Omit<ProgressRangeProps, "className" | "value"> & {
  /** Classes merged onto the 240px root. */
  className?: string;
  /** Inline style, merged onto the bar's own. */
  style?: CSSProperties;
  /**
   * Determinate progress in percent (0-100). Omit it (or pass `null`) for the indeterminate bar, which
   * sweeps a third-width fill across the track. Values outside min-max are clamped.
   * @default null
   */
  value?: number | null;
};

/** The Figma quint curve (`--ease-out-quint`), written out because an inline style cannot read a variable. */
const EASE_OUT_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * One number through `Intl.NumberFormat`, or `fallback` when the engine has no `Intl` (Lynx's
 * native JS engine often does not). The fallback is the caller's because a percentage and a plain
 * number read differently without formatting (`64%` rather than `0.64`).
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

/** The default spoken value of a bar with no value, the same words Base UI uses. */
const INDETERMINATE_TEXT = "indeterminate progress";

/** `min`-`max` as a 0-100 percentage; a zero-width range reports 0 instead of dividing by zero. */
const toPercent = (value: number, min: number, max: number): number => {
  const span = max - min;
  if (!Number.isFinite(span) || span <= 0) return 0;
  const percent = ((value - min) / span) * 100;
  return Math.min(100, Math.max(0, percent));
};

/**
 * Figma `Progress bar` (in Loading 109:733): a 6px 8% ink track with an ink fill.
 *
 * The width animates on a 400ms quint curve when `value` changes, so a value fed from state reads
 * as movement rather than a jump. Base UI's `progressbar` role becomes Lynx's
 * `accessibility-role-description="progressbar"` plus `accessibility-value`, and the indeterminate
 * sweep is the same `sweep` keyframe React's `animate-sweep` class runs.
 *
 * @example
 * ```tsx
 * import { Progress } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <view className="flex flex-col gap-2">
 *       <Progress value={64} aria-label="Upload" />
 *       <Progress aria-label="Loading" />
 *     </view>
 *   );
 * }
 * ```
 */
export function Progress({
  className,
  style,
  value = null,
  min = 0,
  max = 100,
  locale,
  format,
  getAriaValueText,
  "aria-label": ariaLabel,
  "aria-valuetext": ariaValueText,
}: ProgressProps) {
  // A missing or non-finite value is Base UI's indeterminate case, and `Number.isFinite` keeps a NaN
  // from reaching the width as `NaN%`.
  const indeterminate = value === null || !Number.isFinite(value);
  const percent = indeterminate ? null : toPercent(value, min, max);
  // Base UI formats the clamped value, so a value past the range reads as the end it was pinned to.
  // Without `format` the value speaks as its share of the range, which is the same number the bar paints.
  const formatted =
    percent === null || value === null
      ? ""
      : format
        ? formatNumber(Math.max(min, Math.min(value, max)), locale, format, String(value))
        : formatNumber(percent / 100, locale, { style: "percent" }, `${Math.round(percent)}%`);
  // Base UI's precedence: an explicit `aria-valuetext` wins, then `getAriaValueText`, then the
  // formatted value, and the words "indeterminate progress" when there is no value at all.
  const spoken =
    ariaValueText ??
    (getAriaValueText ? getAriaValueText(formatted, value) : indeterminate ? INDETERMINATE_TEXT : formatted);

  return (
    <view
      className={cn("w-60", className)}
      style={style}
      accessibility-element
      accessibility-role-description="progressbar"
      accessibility-label={ariaLabel}
      accessibility-value={spoken}
    >
      <view className="h-1.5 w-full overflow-hidden rounded-full bg-overlay-ink-8">
        <view
          className="h-full rounded-full bg-interactive-primary"
          style={
            indeterminate
              ? {
                  width: "33.3333%",
                  animationName: "sweep",
                  animationDuration: "1.4s",
                  animationTimingFunction: EASE_OUT_QUINT,
                  animationIterationCount: "infinite",
                }
              : { width: `${percent}%`, transitionProperty: "width", transitionDuration: "400ms", transitionTimingFunction: EASE_OUT_QUINT }
          }
        />
      </view>
    </view>
  );
}
