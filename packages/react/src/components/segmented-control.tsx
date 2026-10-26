import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
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
  glass: "overflow-clip border border-glass-rim-strong bg-glass-regular",
  inset: "bg-overlay-ink-5",
  "inset-faint": "bg-overlay-ink-4",
};

/** Single-choice segmented control; the selected segment is 10% ink. */
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
  return (
    <ToggleGroup
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
      {items.map((item) => (
        <Toggle
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className={cn(
            "relative flex min-w-0 cursor-pointer items-center justify-center rounded-full text-label-md whitespace-nowrap text-text-secondary",
            "data-disabled:cursor-not-allowed data-disabled:opacity-40 data-pressed:bg-overlay-ink-10 data-pressed:text-text-primary",
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
