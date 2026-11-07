import type { ReactNode } from "@lynx-js/react";

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
  /** `md` is the 64x48 Figma tab; `sm` is 56x40 and `lg` is 72x56. @default "md" */
  size?: TabBarSize;
  /** `glass` (default) adds the liquid glass layer inside the pill; `flat` keeps the glass fill but omits that layer. @default "glass" */
  surface?: "glass" | "flat";
  /** Accessible name of the navigation landmark. @default "Main" */
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
  sm: "h-10 w-14",
  md: "h-12 w-16",
  lg: "h-14 w-18",
};

/**
 * Figma `Tab bar` (63:441): the mobile bottom navigation, a regular-glass pill
 * with icon-only 64x48 tabs and 22px icons; the current tab is a 10% ink pill
 * that slides to the tab you pick.
 *
 * The bar is controlled: it reports clicks through `onValueChange` and marks the matching
 * item with the selected trait. Tabs keep their fixed tap size, so an over-wide row scrolls
 * horizontally instead of shrinking; the moving pill is measured from the current tab through
 * `useActiveIndicator`, which reads each tab's `layoutchange` box because Lynx has no
 * `offsetLeft` or `querySelector`.
 *
 * @example
 * ```tsx
 * import { useState } from "@lynx-js/react";
 * import { House, MagnifyingGlass, User } from "../icons"; // Icon names, not phosphor components
 * import { Icon, TabBar } from "@horon-ai/lynx";
 *
 * function MobileNav() {
 *   const [tab, setTab] = useState("home");
 *   return (
 *     <TabBar
 *       aria-label="Sections"
 *       value={tab}
 *       onValueChange={setTab}
 *       items={[
 *         { value: "home", label: "Home", icon: <Icon name="House" size={22} /> },
 *         { value: "search", label: "Search", icon: <Icon name="MagnifyingGlass" size={22} /> },
 *         { value: "profile", label: "Profile", icon: <Icon name="User" size={22} /> },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function TabBar({ items, value, onValueChange, size = "md", surface = "glass", className, "aria-label": ariaLabel = "Main" }: TabBarProps) {
  const activeIndex = items.findIndex((item) => item.value === value);
  const { rect, animate, bindTrack, bindItem } = useActiveIndicator(activeIndex);

  return (
    <view
      className={cn(
        // Tabs keep their fixed 56/64/72px tap size; when the row is wider than the
        // container the track scrolls instead of squeezing the icons.
        "relative flex w-fit max-w-full min-w-0 flex-row items-center overflow-hidden rounded-full bg-glass-regular",
        trackClass[size],
        className,
      )}
      accessibility-element
      accessibility-role-description="tabbar"
      accessibility-label={ariaLabel}
    >
      {surface === "glass" ? <LiquidGlass /> : null}
      <scroll-view scroll-orientation="horizontal" className="w-full">
        <view className="relative flex flex-row items-center gap-1" bindlayoutchange={bindTrack}>
          <view
            className={cn("absolute rounded-full bg-overlay-ink-10", animate && "motion-indicator")}
            style={
              rect
                ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height, opacity: 1 }
                : { opacity: 0, left: 0, top: 0, width: 0, height: 0 }
            }
            accessibility-elements-hidden
          />
          {items.map((item, index) => {
            const current = item.value === value;
            return (
              <view
                key={item.value}
                className={cn(
                  "relative flex shrink-0 flex-row motion-press items-center justify-center rounded-full",
                  tabClass[size],
                  current ? "text-text-primary" : "text-text-secondary",
                )}
                bindtap={() => onValueChange?.(item.value)}
                accessibility-element
                accessibility-traits="button"
                accessibility-role-description="tab"
                accessibility-label={item.label}
                accessibility-value={current ? "selected" : undefined}
                {...bindItem(index)}
              >
                {item.icon}
              </view>
            );
          })}
        </view>
      </scroll-view>
    </view>
  );
}
