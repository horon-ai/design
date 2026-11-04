import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { type ReactNode, useRef } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { useActiveIndicator } from "../lib/use-active-indicator";
import { LiquidGlass } from "./liquid-glass";

/** `tab` keeps Paper's page-tab rung beside the three control sizes. */
export type SegmentedControlSize = ControlSize | "tab";
export type SegmentedControlSurface = "solid" | "glass" | "inset" | "inset-faint" | "subtle";

export type SegmentedControlProps = {
  items: { value: string; label: ReactNode; disabled?: boolean }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * `md`: Segmented control (62:379), 36px track, 30px segments, 16px padding.
   * `sm`: one rung down, a 32px track with 26px segments and 10px padding.
   * `lg`: Segmented filter (88:723), 44px track, 36px segments.
   * `tab`: Paper page tabs (Projects Active/Archived), 4px track padding and gap, 32px segments with 14px padding.
   */
  size?: SegmentedControlSize;
  /**
   * `solid` (default) is the opaque surface track with a default border and a 10% ink selection.
   * `glass` is regular glass. `inset` is the 5% ink track inside the routine card,
   * `inset-faint` the 4% ink track inside the header filter. `subtle` is the bg-subtle page-tab tray whose
   * selection is a plain white pill.
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
  lg: "h-11 p-1",
  tab: "gap-1 p-1",
};

const segmentClass: Record<SegmentedControlSize, string> = {
  sm: "h-6.5 px-2.5 text-label-sm",
  md: "h-7.5 px-4 text-label-md",
  lg: "h-9 px-4 text-label-lg",
  tab: "h-8 px-3.5 text-label-md",
};

const surfaceClass: Record<SegmentedControlSurface, string> = {
  solid: "border border-border-default bg-bg-surface",
  glass: "overflow-clip bg-glass-regular",
  inset: "bg-overlay-ink-5",
  "inset-faint": "bg-overlay-ink-4",
  subtle: "bg-bg-subtle",
};

/**
 * Single-choice segmented control. The selection is one pill that slides to the
 * pressed segment. On the glass track it is a glass pill over the glass track,
 * thick fill and a 0 1 3 8% shadow, the iOS tab bar selection; dark mode keeps a
 * 10% fill. On the solid and inset tracks it is 10% ink. The pill is the same on
 * every rung, as in `Tabs`.
 */
export function SegmentedControl({
  items,
  value,
  defaultValue,
  onValueChange,
  size = "md",
  surface = "solid",
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
      {surface === "glass" && <LiquidGlass />}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute overflow-clip rounded-full",
          surface === "glass"
            ? "bg-glass-thick shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:bg-overlay-ink-10"
            : surface === "subtle"
              ? "bg-bg-default dark:bg-overlay-ink-10"
              : "bg-overlay-ink-10",
          animate && "motion-indicator",
        )}
        style={rect ? { ...rect, opacity: 1 } : { opacity: 0 }}
      >
        {surface === "glass" && <LiquidGlass />}
      </span>
      {items.map((item) => (
        <Toggle
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className={cn(
            "relative flex min-w-0 cursor-pointer items-center justify-center rounded-full whitespace-nowrap text-text-secondary motion-colors",
            "hover:text-text-primary data-disabled:cursor-not-allowed data-disabled:opacity-40 data-pressed:text-text-primary",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
            segmentClass[size],
            fill && "flex-1",
          )}
        >
          <span className="text-trim">{item.label}</span>
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
