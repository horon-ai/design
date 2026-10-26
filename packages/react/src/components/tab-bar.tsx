import type { ReactNode } from "react";

import { cn } from "../lib/cn";
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
 * with icon-only 64x48 tabs and 22px icons; the current tab is 10% ink.
 */
export function TabBar({ items, value, onValueChange, className, ...props }: TabBarProps) {
  return (
    <nav
      aria-label={props["aria-label"] ?? "Main"}
      className={cn(
        "relative flex w-fit items-center gap-1 overflow-clip rounded-full border border-glass-rim-strong bg-glass-regular p-1.5",
        className,
      )}
    >
      <LiquidGlass tier="regular" />
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
              "relative flex h-12 w-16 cursor-pointer items-center justify-center rounded-full [&_svg]:size-5.5",
              current ? "bg-overlay-ink-10 text-text-primary" : "text-text-secondary",
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
