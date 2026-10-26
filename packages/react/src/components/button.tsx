import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type ButtonVariant = "primary" | "glass" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<ComponentProps<typeof BaseButton>, "className"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading icon; sized 16px (sm, md) or 20px (lg) and colored like the label. */
  icon?: ReactNode;
  className?: string;
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-label-md [&_svg]:size-4",
  md: "h-10 gap-2 px-4 text-label-lg [&_svg]:size-4",
  lg: "h-12 gap-2 px-5 text-label-lg [&_svg]:size-5",
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-interactive-primary text-interactive-on-primary hover:not-data-disabled:bg-interactive-primary-hover active:not-data-disabled:bg-interactive-primary-pressed",
  glass:
    "overflow-clip border border-glass-rim-strong bg-glass-clear text-text-primary hover:not-data-disabled:bg-glass-clear-hover active:not-data-disabled:bg-glass-clear-pressed",
  danger:
    "bg-interactive-danger text-interactive-on-danger hover:not-data-disabled:bg-interactive-danger-hover active:not-data-disabled:bg-interactive-danger-hover",
};

/** Figma `Button` (55:339): Primary, Glass and Danger in three sizes. */
export function Button({ variant = "primary", size = "md", icon, className, children, ...props }: ButtonProps) {
  return (
    <BaseButton
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full whitespace-nowrap select-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand data-disabled:cursor-not-allowed data-disabled:opacity-40",
        sizeClass[size],
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {variant === "glass" && <LiquidGlass />}
      {icon && <span className="relative flex shrink-0">{icon}</span>}
      <span className="relative">{children}</span>
    </BaseButton>
  );
}
