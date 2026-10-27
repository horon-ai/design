import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { type ReactNode, useRef } from "react";

import { cn } from "../lib/cn";
import { useActiveIndicator } from "../lib/use-active-indicator";
import { LiquidGlass } from "./liquid-glass";

export type SegmentedControlSize = "sm" | "md" | "lg";
export type SegmentedControlSurface = "glass" | "inset" | "inset-faint";

export type SegmentedControlProps = {
  items: { value: string; label: ReactNode; disabled?: boolean }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * `md`: Segmented control (62:379), 36px track, 30px segments, 16px padding.
   * `sm`: Frequency (110:765), 30px segments with 12px padding.
   * `lg`: Segmented filter (88:723), 44px track, 36px segments.
   */
  size?: SegmentedControlSize;
  /**
   * `glass` is regular glass. `inset` is the 5% ink track inside the routine card,
   * `inset-faint` the 4% ink track inside the header filter.
   */
  surface?: SegmentedControlSurface;
  /** Segments share the width equally instead of hugging their labels. */
  fill?: boolean;
  "aria-label"?: string;
  className?: string;
};

const trackClass: Record<SegmentedControlSize, string> = {
  sm: "p-[3px]",
  md: "h-9 p-[3px]",
  lg: "h-11 px-1",
};

const segmentClass: Record<SegmentedControlSize, string> = {
  sm: "h-7.5 px-3",
  md: "h-7.5 px-4",
  lg: "h-9 px-4",
};

const surfaceClass: Record<SegmentedControlSurface, string> = {
  glass: "overflow-clip bg-glass-regular",
  inset: "bg-overlay-ink-5",
  "inset-faint": "bg-overlay-ink-4",
};

/**
 * Single-choice segmented control. The selection is one pill that slides to the
 * pressed segment. On the glass track it is a clear glass pill (Figma 62:379):
 * thick-glass fill, 1px strong rim and a 0 1 3 8% shadow; dark mode keeps a 10%
 * fill, as the Components / Dark board does. On the inset tracks it is 10% ink.
 * The moving pill keeps the CSS glass: refraction on a sliding layer leaks a
 * square frost past its rounded clip and re-renders every frame.
 */
export function SegmentedControl({
  items,
  value,
  defaultValue,
  onValueChange,
  size = "md",
  surface = "glass",
  fill = size === "md",
  className,
  ...props
}: SegmentedControlProps) {
  const track = useRef<HTMLDivElement>(null);
  const { rect, animate } = useActiveIndicator(track, "[data-pressed]");
  return (
    <ToggleGroup
      ref={track}
      value={value === undefined ? undefined : [value]}
      defaultValue={defaultValue === undefined ? undefined : [defaultValue]}
      onValueChange={(next) => {
        if (next[0] !== undefined) onValueChange?.(next[0]);
      }}
      className={cn(
        "relative flex items-center gap-0.5 rounded-full",
        trackClass[size],
        surfaceClass[surface],
        className,
      )}
      aria-label={props["aria-label"]}
    >
      {surface === "glass" && <LiquidGlass tier="regular" />}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute overflow-clip rounded-full",
          surface === "glass" && size !== "lg"
            ? "border border-glass-rim-strong bg-glass-thick shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:bg-overlay-ink-10"
            : "bg-overlay-ink-10",
          animate && "motion-indicator",
        )}
        style={rect ? { ...rect, opacity: 1 } : { opacity: 0 }}
      >
        {surface === "glass" && size !== "lg" && <LiquidGlass tier="clear" refract={false} />}
      </span>
      {items.map((item) => (
        <Toggle
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className={cn(
            "relative flex min-w-0 cursor-pointer items-center justify-center rounded-full text-label-md whitespace-nowrap text-text-secondary motion-colors",
            "data-disabled:cursor-not-allowed data-disabled:opacity-40 data-pressed:text-text-primary",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
            segmentClass[size],
            fill && "flex-1",
          )}
        >
          {item.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
