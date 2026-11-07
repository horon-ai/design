import { type ReactNode, useRef } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { useActiveIndicator } from "../hooks/use-active-indicator";
import { LiquidGlass } from "./liquid-glass";

/** One destination in a {@link TabBar}: its stable value, the accessible name, and the icon shown in the tab. */
export type TabBarItem = {
  /** Identifies the tab; compared against the bar's `value`. */
  value: string;
  /** Accessible name of the icon-only button. */
  label: string;
  /** The tab icon; sized by the bar (20/22/24px per rung). */
  icon: ReactNode;
};

/** Tab bar rungs: `sm` 56x40, `md` 64x48 (the Figma size) and `lg` 72x56. */
export type TabBarSize = ControlSize;

/** Props of {@link TabBar}: the destinations, the selected value, and the track rung and surface. */
export type TabBarProps = {
  /** Destinations in display order; each keeps its fixed tap size and scrolls if the row overflows. */
  items: TabBarItem[];
  /** Currently selected item's `value`; the control is fully controlled. */
  value: string;
  /** Called with the clicked item's `value`; the bar itself does not change `value`. */
  onValueChange?: (value: string) => void;
  /** `md` is the 64x48 Figma tab; `sm` is 56x40 and `lg` 72x56. @default "md" */
  size?: TabBarSize;
  /** `glass` (default) adds the liquid glass layer inside the pill; `flat` keeps the glass fill but omits that layer. @default "glass" */
  surface?: "glass" | "flat";
  /** Accessible name of the `<nav>` landmark. @default "Main" */
  "aria-label"?: string;
  /** Extra classes on the scrolling track. */
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
 *
 * The bar is controlled: it reports clicks through `onValueChange` and marks the matching
 * item with `aria-current="page"`. Tabs keep their fixed tap size, so an over-wide row scrolls
 * horizontally instead of shrinking; the moving pill is measured from the current tab and
 * honours `prefers-reduced-motion`.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { House, MagnifyingGlass, User } from "@phosphor-icons/react";
 * import { TabBar } from "@horon-ai/react";
 *
 * function MobileNav() {
 *   const [tab, setTab] = useState("home");
 *   return (
 *     <TabBar
 *       aria-label="Sections"
 *       value={tab}
 *       onValueChange={setTab}
 *       items={[
 *         { value: "home", label: "Home", icon: <House /> },
 *         { value: "search", label: "Search", icon: <MagnifyingGlass /> },
 *         { value: "profile", label: "Profile", icon: <User /> },
 *       ]}
 *     />
 *   );
 * }
 * ```
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
