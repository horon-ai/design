import { useState, type ReactNode } from "@lynx-js/react";

import { useActiveIndicator } from "../hooks/use-active-indicator";
import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { useHoronTheme } from "../provider";
import { LiquidGlass } from "./liquid-glass";

/** `tab` keeps Paper's page-tab rung beside the three control sizes. */
export type SegmentedControlSize = ControlSize | "tab";

/**
 * Track treatment of a segmented control.
 *
 * - `solid` — opaque surface track with a default border and a 10% ink selection.
 * - `glass` — regular glass; the selection is a thick glass pill over it.
 * - `inset` — 5% ink track, for use inside a routine card.
 * - `inset-faint` — 4% ink track, for the header filter row.
 * - `subtle` — `bg-subtle` page-tab tray whose selection is a plain surface pill.
 */
export type SegmentedControlSurface = "solid" | "glass" | "inset" | "inset-faint" | "subtle";

/**
 * Props for {@link SegmentedControl}. The control is single-choice: only one item value is selected.
 */
export type SegmentedControlProps = {
  /** Segments in display order; `value` is what `onValueChange` returns and `disabled` dims one segment. */
  items: {
    /** Value reported when this segment is chosen. */
    value: string;
    /** Text on the segment. */
    label: ReactNode;
    /** Disables only this segment; it cannot be selected. */
    disabled?: boolean;
  }[];
  /** Selected value in controlled mode. */
  value?: string;
  /** Selected value at first render in uncontrolled mode. */
  defaultValue?: string;
  /** Fires with the chosen value when the selection changes. */
  onValueChange?: (value: string) => void;
  /**
   * `md`: Segmented control (62:379), 36px track, 30px segments, 16px padding.
   * `sm`: one rung down, a 32px track with 26px segments and 10px padding.
   * `lg`: Segmented filter (88:723), 44px track, 36px segments.
   * `tab`: Paper page tabs (Projects Active/Archived), 4px track padding and gap, 32px segments with 14px padding.
   * @default "md"
   */
  size?: SegmentedControlSize;
  /**
   * `solid` (default) is the opaque surface track with a default border and a 10% ink selection.
   * `glass` is regular glass. `inset` is the 5% ink track inside the routine card,
   * `inset-faint` the 4% ink track inside the header filter. `subtle` is the bg-subtle page-tab tray whose
   * selection is a plain white pill.
   * @default "solid"
   */
  surface?: SegmentedControlSurface;
  /**
   * Segments share the width equally instead of hugging their labels.
   * @default size === "md"
   */
  fill?: boolean;
  /** Accessible name of the toggle group. */
  "aria-label"?: string;
  /** Classes merged onto the track. */
  className?: string;
};

const trackClass: Record<SegmentedControlSize, string> = {
  sm: "p-[3px]",
  md: "h-9 p-[3px]",
  lg: "h-11 p-1",
  tab: "gap-1 p-1",
};

const segmentClass: Record<SegmentedControlSize, string> = {
  sm: "h-[26px] px-2.5 text-label-sm",
  md: "h-[30px] px-4 text-label-md",
  lg: "h-9 px-4 text-label-lg",
  tab: "h-8 px-3.5 text-label-md",
};

const surfaceClass: Record<SegmentedControlSurface, string> = {
  solid: "border border-border-default bg-bg-surface",
  glass: "overflow-hidden bg-glass-regular",
  inset: "bg-overlay-ink-5",
  "inset-faint": "bg-overlay-ink-4",
  subtle: "bg-bg-subtle",
};

/**
 * Figma segmented control (62:379) in one file for every rung and track: a rounded track
 * holding equal-height segments, with one selection pill that slides to the pressed segment.
 *
 * The pill is positioned from the measured box of the active segment: `useActiveIndicator`
 * listens to `bindlayoutchange` on the segments and returns the active one's rect, so the pill
 * travels the real distance between two different label widths instead of a guessed percentage.
 * The first frame draws no pill (measurement arrives asynchronously), and the spring
 * `motion-indicator` class is only added once the pill has been placed, so it lands instead of
 * flying in from the corner.
 *
 * Only Play and Radio Group can clear a previous pick, so the control holds its own selection
 * when `value` is not passed. A Lynx view cannot scroll inside a measured pill, so the track
 * clips its content; a label set wider than the track needs `fill` or a wider caller.
 *
 * @example
 * ```tsx
 * import { useState } from "@lynx-js/react";
 * import { SegmentedControl } from "@horon-ai/lynx";
 *
 * function Example() {
 *   const [view, setView] = useState("active");
 *   return (
 *     <SegmentedControl
 *       aria-label="Projects"
 *       value={view}
 *       onValueChange={setView}
 *       items={[
 *         { value: "active", label: "Active" },
 *         { value: "archived", label: "Archived" },
 *       ]}
 *     />
 *   );
 * }
 * ```
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
  "aria-label": ariaLabel,
}: SegmentedControlProps) {
  const { scheme } = useHoronTheme();
  const [own, setOwn] = useState<string | undefined>(defaultValue);
  const selected = value === undefined ? own : value;
  const activeIndex = items.findIndex((item) => item.value === selected);
  const { rect, animate, bindTrack, bindItem } = useActiveIndicator(activeIndex < 0 ? 0 : activeIndex);

  const pick = (next: string, unavailable: boolean | undefined) => {
    if (unavailable || next === selected) return;
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
  };

  // The measured row holds the segments and the pill. A filled row shares the track, so it takes
  // the whole width; a hugging row keeps each segment's own padding and scrolls inside the track
  // when the set is wider than the caller's box, which is what react's `overflow-x-auto` does.
  const row = (
    <view
      className={cn("relative flex flex-row items-center gap-0.5", fill && "w-full min-w-0")}
      bindlayoutchange={bindTrack}
    >
      <view
        className={cn(
          "pointer-events-none absolute overflow-hidden rounded-full",
          // The glass pill is a thick glass fill in light and a 10% ink wash in dark, exactly the
          // pair react writes as `bg-glass-thick dark:bg-overlay-ink-10`; Lynx has no `dark:`
          // variant here, so the scheme picks the class.
          surface === "glass"
            ? scheme === "dark"
              ? "bg-overlay-ink-10 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              : "bg-glass-thick shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
            : surface === "subtle"
              ? scheme === "dark"
                ? "bg-overlay-ink-10"
                : "bg-bg-default"
              : "bg-overlay-ink-10",
          animate && "motion-indicator",
        )}
        style={{
          left: `${rect?.left ?? 0}px`,
          top: `${rect?.top ?? 0}px`,
          width: `${rect?.width ?? 0}px`,
          height: `${rect?.height ?? 0}px`,
          opacity: rect ? 1 : 0,
        }}
        accessibility-elements-hidden
      >
        {surface === "glass" ? <LiquidGlass /> : null}
      </view>
      {items.map((item, index) => (
        <view
          key={item.value}
          className={cn(
            "relative flex min-w-0 flex-row items-center justify-center whitespace-nowrap rounded-full motion-colors",
            item.disabled && "opacity-40",
            item.value === selected ? "text-text-primary" : "text-text-secondary active:text-text-primary",
            segmentClass[size],
            // Filled segments share the track; hugging segments keep the padding their rung gives them.
            fill ? "flex-1" : "shrink-0",
          )}
          bindtap={() => pick(item.value, item.disabled)}
          accessibility-element
          accessibility-traits={item.disabled ? "disabled" : "button"}
          accessibility-role-description="tab"
          accessibility-label={typeof item.label === "string" ? item.label : undefined}
          accessibility-value={item.value === selected ? "selected" : "unselected"}
          {...bindItem(index)}
        >
          {typeof item.label === "string" ? <text className="text-trim">{item.label}</text> : item.label}
        </view>
      ))}
    </view>
  );

  return (
    <view
      className={cn(
        // Segments keep the padding their rung gives them; a filled row shares the width instead.
        "relative inline-flex max-w-full min-w-0 flex-row items-center overflow-hidden rounded-full",
        trackClass[size],
        surfaceClass[surface],
        className,
      )}
      accessibility-element
      accessibility-role-description="tablist"
      accessibility-label={ariaLabel}
    >
      {surface === "glass" ? <LiquidGlass /> : null}
      {fill ? row : (
        <scroll-view scroll-orientation="horizontal" className="max-w-full">
          {row}
        </scroll-view>
      )}
    </view>
  );
}
