import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type ButtonVariant = "primary" | "glass" | "danger" | "link";
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
    "overflow-clip bg-glass-clear text-text-primary hover:not-data-disabled:bg-glass-clear-hover active:not-data-disabled:bg-glass-clear-pressed",
  danger:
    "bg-interactive-danger text-interactive-on-danger hover:not-data-disabled:bg-interactive-danger-hover active:not-data-disabled:bg-interactive-danger-hover",
  link: "h-auto gap-1.5 rounded-sm px-1 text-label-sm text-text-secondary motion-colors hover:not-data-disabled:text-text-primary [&_svg]:size-3.5",
};

/** Figma `Button` (55:339): Primary, Glass and Danger in three sizes, plus a text-only `link` variant (size-independent). */
export function Button({ variant = "primary", size = "md", icon, className, children, ...props }: ButtonProps) {
  return (
    <BaseButton
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap select-none",
        variant === "link" ? "" : "motion-press rounded-full",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand data-disabled:cursor-not-allowed data-disabled:opacity-40",
        variant !== "link" && sizeClass[size],
        // Paper's small buttons are 32px tall. Paint the 44px reach without moving the control;
        // glass clips to its own box, so it keeps its visible size as the only target.
        variant !== "link" &&
          variant !== "glass" &&
          size !== "lg" &&
          "relative after:absolute after:top-1/2 after:left-1/2 after:min-h-11 after:min-w-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
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
