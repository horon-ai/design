import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { LiquidGlass } from "./liquid-glass";

export type IconButtonVariant = "primary" | "ghost" | "glass" | "solid" | "quiet";
export type IconButtonSize = ControlSize;

export type IconButtonProps = Omit<ComponentProps<typeof BaseButton>, "className" | "children"> & {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: ReactNode;
  /** Accessible name; the button has no visible text. */
  label: string;
  className?: string;
};

const sizeClass: Record<IconButtonSize, string> = {
  sm: "size-8 [&_svg]:size-4",
  md: "size-10 [&_svg]:size-5",
  lg: "size-12 [&_svg]:size-6",
};

const variantClass: Record<IconButtonVariant, string> = {
  primary:
    "bg-interactive-primary text-interactive-on-primary hover:not-data-disabled:bg-interactive-primary-hover active:not-data-disabled:bg-interactive-primary-pressed",
  ghost: "text-text-primary hover:not-data-disabled:bg-overlay-ink-6 active:not-data-disabled:bg-overlay-ink-10",
  glass:
    "overflow-clip bg-glass-clear text-text-primary hover:not-data-disabled:bg-glass-clear-hover active:not-data-disabled:bg-glass-clear-pressed",
  solid:
    "border border-border-default bg-bg-surface text-text-primary hover:not-data-disabled:bg-bg-subtle active:not-data-disabled:bg-interactive-secondary-hover",
  // No fill and no liquid layer: only the ink wash on hover/press. A glass disc is wrong on a dark
  // shell or title bar, where `glass` reads as a grey bubble; this keeps the icon legible without one.
  quiet:
    "text-text-secondary hover:not-data-disabled:bg-overlay-ink-6 hover:not-data-disabled:text-text-primary active:not-data-disabled:bg-overlay-ink-10",
};

/** Figma `Icon button` (57:167): Primary, Ghost, Glass and Solid in three sizes, plus a fill-free `quiet` variant. */
export function IconButton({ variant = "ghost", size = "md", icon, label, className, ...props }: IconButtonProps) {
  return (
    <BaseButton
      aria-label={label}
      className={cn(
        "relative inline-flex shrink-0 motion-press cursor-pointer items-center justify-center rounded-full select-none",
        // Paper draws icon buttons down to 32px. The painted hit area keeps the 44px reach
        // without moving a single pixel of the visible control.
        "relative after:absolute after:top-1/2 after:left-1/2 after:min-h-11 after:min-w-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand data-disabled:cursor-not-allowed data-disabled:opacity-40",
        sizeClass[size],
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {variant === "glass" && <LiquidGlass />}
      <span className="relative flex">{icon}</span>
    </BaseButton>
  );
}
