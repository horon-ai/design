import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

export type InputSize = ControlSize;
export type InputSurface = "glass" | "solid" | "solid-on-page";

export type InputProps = Omit<ComponentProps<typeof BaseInput>, "className" | "size"> & {
  size?: InputSize;
  /** `glass` over imagery and glass panels, `solid` on raised surfaces, `solid-on-page` directly on the page background. */
  surface?: InputSurface;
  /** Leading icon, 16px (sm, md) or 20px (lg), in the secondary text color. */
  icon?: ReactNode;
  /** Shows the error border. Inside a `Field`, an invalid field does the same. */
  invalid?: boolean;
  className?: string;
  /** Classes for the native `<input>`. */
  inputClassName?: string;
};

/** Height, horizontal padding and icon size shared by every field-style control. */
export const fieldSizeClass: Record<ControlSize, string> = {
  sm: "h-8 gap-1.5 px-3 [&_svg]:size-4",
  md: "h-10 gap-2 px-3.5 [&_svg]:size-4",
  lg: "h-12 gap-2.5 px-5 [&_svg]:size-5",
};

/** Body text size that matches each control rung. */
export const fieldTextClass: Record<ControlSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
};

export const fieldBoxClass = {
  /** The box is the focus target's container, so the ring is drawn on `:focus-within`, not on the inner input. */
  base: "motion-colors relative flex items-center overflow-clip rounded-md border focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-text-brand",
  /** The veil field (globals.css `.veil-field`): no liquid layers, so hosts render no `LiquidGlass`. */
  glass: "veil-field has-[[data-disabled]]:opacity-60 has-[:disabled]:opacity-60",
  solid:
    "border-border-default bg-bg-surface has-[[data-disabled]]:border-border-default has-[:disabled]:border-border-default has-[[data-disabled]]:bg-bg-subtle has-[:disabled]:bg-bg-subtle has-[[data-invalid]]:border-border-danger data-invalid:border-border-danger",
  "solid-on-page":
    "border-border-default bg-bg-default has-[[data-disabled]]:border-border-default has-[:disabled]:border-border-default has-[[data-disabled]]:bg-bg-subtle has-[:disabled]:bg-bg-subtle has-[[data-invalid]]:border-border-danger data-invalid:border-border-danger",
  text: "min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder disabled:cursor-not-allowed disabled:text-text-disabled",
} as const;

/** Figma `Input` (58:126): SM, MD and LG, on Glass or Solid surface. */
export function Input({
  size = "md",
  surface = "solid",
  icon,
  invalid,
  className,
  inputClassName,
  ...props
}: InputProps) {
  return (
    <div
      className={cn(fieldBoxClass.base, fieldBoxClass[surface], fieldSizeClass[size], className)}
      data-invalid={invalid ? "" : undefined}
    >
      {icon && <span className="relative flex shrink-0 text-text-secondary">{icon}</span>}
      <BaseInput
        aria-invalid={invalid || undefined}
        className={cn("relative", fieldBoxClass.text, fieldTextClass[size], inputClassName)}
        {...props}
      />
    </div>
  );
}
