import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type IconButtonVariant = "primary" | "ghost" | "glass";
export type IconButtonSize = "sm" | "md" | "lg";

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
    "overflow-clip border border-glass-rim-strong bg-glass-clear text-text-primary hover:not-data-disabled:bg-glass-clear-hover active:not-data-disabled:bg-glass-clear-pressed",
};

/** Figma `Icon button` (57:167): Primary, Ghost and Glass in three sizes. */
export function IconButton({ variant = "ghost", size = "md", icon, label, className, ...props }: IconButtonProps) {
  return (
    <BaseButton
      aria-label={label}
      className={cn(
        "relative inline-flex shrink-0 motion-press cursor-pointer items-center justify-center rounded-full select-none",
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
