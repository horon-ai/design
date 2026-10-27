import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type InputSize = "md" | "lg";
export type InputSurface = "glass" | "solid";

export type InputProps = Omit<ComponentProps<typeof BaseInput>, "className" | "size"> & {
  size?: InputSize;
  /** `glass` over imagery and glass panels, `solid` on plain backgrounds. */
  surface?: InputSurface;
  /** Leading icon, 16px (md) or 20px (lg), in the secondary text color. */
  icon?: ReactNode;
  /** Shows the error border. Inside a `Field`, an invalid field does the same. */
  invalid?: boolean;
  className?: string;
  /** Classes for the native `<input>`. */
  inputClassName?: string;
};

const sizeClass: Record<InputSize, string> = {
  md: "h-10 [&_svg]:size-4",
  lg: "h-12 [&_svg]:size-5",
};

const textClass: Record<InputSize, string> = {
  md: "text-body-md",
  lg: "text-body-lg",
};

export const fieldBoxClass = {
  base: "motion-colors relative flex items-center gap-2 overflow-clip rounded-md border px-3.5",
  glass:
    "border-glass-rim-strong bg-glass-regular has-[[data-invalid]]:border-border-danger data-invalid:border-border-danger",
  solid:
    "border-border-default bg-bg-surface hover:border-border-strong has-[[data-disabled]]:border-border-default has-[[data-disabled]]:bg-bg-subtle has-[[data-invalid]]:border-border-danger data-invalid:border-border-danger",
  text: "min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder disabled:cursor-not-allowed disabled:text-text-disabled",
} as const;

/** Figma `Input` (58:126): MD and LG, on Glass or Solid surface. */
export function Input({
  size = "md",
  surface = "glass",
  icon,
  invalid,
  className,
  inputClassName,
  ...props
}: InputProps) {
  return (
    <div
      className={cn(
        fieldBoxClass.base,
        fieldBoxClass[surface],
        sizeClass[size],
        "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-text-brand",
        className,
      )}
      data-invalid={invalid ? "" : undefined}
    >
      {surface === "glass" && <LiquidGlass tier="regular" />}
      {icon && <span className="relative flex shrink-0 text-text-secondary">{icon}</span>}
      <BaseInput
        aria-invalid={invalid || undefined}
        className={cn("relative", fieldBoxClass.text, textClass[size], inputClassName)}
        {...props}
      />
    </div>
  );
}
