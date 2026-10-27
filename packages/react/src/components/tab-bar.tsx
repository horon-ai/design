import { type ReactNode, useRef } from "react";

import { cn } from "../lib/cn";
import { useActiveIndicator } from "../lib/use-active-indicator";
import { LiquidGlass } from "./liquid-glass";

export type TabBarItem = { value: string; label: string; icon: ReactNode };

export type TabBarProps = {
  items: TabBarItem[];
  value: string;
  onValueChange?: (value: string) => void;
  "aria-label"?: string;
  className?: string;
};

/**
 * Figma `Tab bar` (63:441): the mobile bottom navigation, a regular-glass pill
 * with icon-only 64x48 tabs and 22px icons; the current tab is a 10% ink pill
 * that slides to the tab you pick.
 */
export function TabBar({ items, value, onValueChange, className, ...props }: TabBarProps) {
  const track = useRef<HTMLElement>(null);
  const { rect, animate } = useActiveIndicator(track, '[aria-current="page"]');
  return (
    <nav
      ref={track}
      aria-label={props["aria-label"] ?? "Main"}
      className={cn(
        "relative flex w-fit items-center gap-1 overflow-clip rounded-full border border-glass-rim-strong bg-glass-regular p-1.5",
        className,
      )}
    >
      <LiquidGlass tier="regular" />
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
              "relative flex h-12 w-16 motion-press cursor-pointer items-center justify-center rounded-full [&_svg]:size-5.5",
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
