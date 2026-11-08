import type { ReactNode } from "@lynx-js/react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

/** Text slots take a string so the token classes can sit on a `<text>`; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Props for {@link UsageMeter}.
 */
export type UsageMeterProps = {
  /** What the meter measures, such as "Tasks used"; sits left of the percentage. */
  label: ReactNode;
  /** 0-100. */
  value: number;
  /** Left caption, such as "6,420 of 10,000 tasks". */
  detail?: ReactNode;
  /** Right caption, such as "Resets Nov 1". */
  note?: ReactNode;
  /** `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass card. @default "solid" */
  surface?: "solid" | "glass";
  /** Extra classes for the meter root. */
  className?: string;
};

/** The Figma quint curve, written out because an inline style cannot read a CSS variable. */
const EASE_OUT_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";

/** `value` as a 0-100 percentage the track can paint; a non-finite value reports 0. */
const toPercent = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
};

/**
 * Figma `Usage meter` (in Loading 109:733): a card with a 6px sky fill, solid or thick glass.
 *
 * React built this on Base UI `Meter`, which exposed the percentage and its formatted value to
 * assistive technology and animated the fill width. Lynx has no such primitive, so the same
 * semantics come from `accessibility-role-description="progressbar"` plus `accessibility-value`,
 * and the fill width transitions over 400ms on the quint curve. The fill is the single `sky-500`
 * accent; the card caps at 300px wide.
 *
 * @example
 * ```tsx
 * import { UsageMeter } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <UsageMeter
 *       label="Tasks"
 *       value={64}
 *       detail="6,420 of 10,000 tasks"
 *       note="Resets Nov 1"
 *     />
 *   );
 * }
 * ```
 */
export function UsageMeter({ label, value, detail, note, surface = "solid", className }: UsageMeterProps) {
  const percent = toPercent(value);

  return (
    <view
      className={cn(
        "relative flex w-full min-w-0 max-w-[300px] flex-col gap-2 overflow-hidden rounded-xl p-4",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        className,
      )}
      accessibility-element
      accessibility-role-description="progressbar"
      accessibility-value={`${Math.round(percent)}%`}
      accessibility-label={typeof label === "string" ? label : undefined}
    >
      {surface === "glass" && <LiquidGlass />}
      <view className="relative flex w-full flex-row items-center gap-2">
        <view className="min-w-0 flex-1">
          {isPlainText(label) ? <text className="text-label-md text-text-primary">{label}</text> : label}
        </view>
        <text className="shrink-0 text-label-md tabular-nums text-text-secondary">{`${Math.round(percent)}%`}</text>
      </view>
      <view className="relative h-1.5 w-full overflow-hidden rounded-full bg-overlay-ink-8">
        <view
          className="h-full rounded-full bg-sky-500"
          style={{
            width: `${percent}%`,
            transitionProperty: "width",
            transitionDuration: "400ms",
            transitionTimingFunction: EASE_OUT_QUINT,
          }}
        />
      </view>
      {detail || note ? (
        <view className="relative flex w-full flex-row items-center gap-2">
          <view className="min-w-0 flex-1">
            {isPlainText(detail) ? <text className="text-caption text-text-secondary">{detail}</text> : detail}
          </view>
          {note ? (
            <view className="shrink-0 whitespace-nowrap">
              {isPlainText(note) ? <text className="text-caption text-text-secondary">{note}</text> : note}
            </view>
          ) : null}
        </view>
      ) : null}
    </view>
  );
}
