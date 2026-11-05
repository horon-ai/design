import { type ReactNode, useRef } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { useActiveIndicator } from "../lib/use-active-indicator";
import { LiquidGlass } from "./liquid-glass";

export type TabBarItem = { value: string; label: string; icon: ReactNode };
export type TabBarSize = ControlSize;

export type TabBarProps = {
  items: TabBarItem[];
  value: string;
  onValueChange?: (value: string) => void;
  /** `md` is the 64x48 Figma tab; `sm` is 56x40 and `lg` 72x56. */
  size?: TabBarSize;
  surface?: "glass" | "flat";
  "aria-label"?: string;
  className?: string;
};

const trackClass: Record<TabBarSize, string> = {
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2",
};

const tabClass: Record<TabBarSize, string> = {
  sm: "h-10 w-14 [&_svg]:size-5",
  md: "h-12 w-16 [&_svg]:size-5.5",
  lg: "h-14 w-18 [&_svg]:size-6",
};

/**
 * Figma `Tab bar` (63:441): the mobile bottom navigation, a regular-glass pill
 * with icon-only 64x48 tabs and 22px icons; the current tab is a 10% ink pill
 * that slides to the tab you pick.
 */
export function TabBar({
  items,
  value,
  onValueChange,
  size = "md",
  surface = "glass",
  className,
  ...props
}: TabBarProps) {
  const track = useRef<HTMLElement>(null);
  const { rect, animate } = useActiveIndicator(track, '[aria-current="page"]');
  return (
    <nav
      ref={track}
      aria-label={props["aria-label"] ?? "Main"}
      className={cn(
        // Tabs keep their fixed 56/64/72px tap size; when the row is wider than the
        // container the track scrolls instead of squeezing the icons.
        "relative flex w-fit max-w-full min-w-0 items-center gap-1 overflow-x-auto overflow-y-clip rounded-full bg-glass-regular",
        trackClass[size],
        className,
      )}
    >
      {surface === "glass" ? <LiquidGlass /> : null}
      <span
        aria-hidden
        className={cn("pointer-events-none absolute rounded-full bg-overlay-ink-10", animate && "motion-indicator")}
        style={rect ? { ...rect, opacity: 1 } : { opacity: 0 }}
      />
      {items.map((item) => {
        const current = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            aria-label={item.label}
            aria-current={current ? "page" : undefined}
            onClick={() => onValueChange?.(item.value)}
            className={cn(
              "relative flex shrink-0 motion-press cursor-pointer items-center justify-center rounded-full",
              tabClass[size],
              current ? "text-text-primary" : "text-text-secondary hover:bg-overlay-ink-5",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
            )}
          >
            {item.icon}
          </button>
        );
      })}
    </nav>
  );
}
