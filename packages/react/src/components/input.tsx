import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/** Height rung shared with every sized control: `sm` 32px, `md` 40px, `lg` 48px. */
export type InputSize = ControlSize;

/**
 * Where the input sits:
 *
 * - `glass`: on imagery or a glass panel; uses the veil field (`.veil-field`) with no liquid layer inside.
 * - `solid`: on a raised surface (`bg-bg-surface`), the default.
 * - `solid-on-page`: directly on the page background (`bg-bg-default`), so the box reads against it.
 */
export type InputSurface = "glass" | "solid" | "solid-on-page";

/** Props of {@link Input}: the native input attributes plus the box's size, surface and decorations. */
export type InputProps = Omit<ComponentProps<typeof BaseInput>, "className" | "size"> & {
  /** Height and text rung: 32/40/48px with `body-sm/md/lg` text. @default "md" */
  size?: InputSize;
  /** `glass` over imagery and glass panels, `solid` on raised surfaces, `solid-on-page` directly on the page background. @default "solid" */
  surface?: InputSurface;
  /** Leading icon, 16px (sm, md) or 20px (lg), in the secondary text color. */
  icon?: ReactNode;
  /** Shows the error border. Inside a `Field`, an invalid field does the same. */
  invalid?: boolean;
  /** Extra classes for the box that wraps the input. */
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

/**
 * The class set a field-shaped control composes: the box (border, radius, focus ring), the surface fill and
 * the inner text/input. Shared by `Input` and `InputGroup` so every field-style control stays one material.
 */
export const fieldBoxClass = {
  /** The box is the focus target's container, so the ring is drawn on `:focus-within`, not on the inner input. */
  base: "motion-colors relative flex min-w-0 max-w-full items-center overflow-clip rounded-md border focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-text-brand",
  /** The veil field (globals.css `.veil-field`): no liquid layers, so hosts render no `LiquidGlass`. */
  glass: "veil-field has-[[data-disabled]]:opacity-60 has-[:disabled]:opacity-60",
  /** Raised surface fill with a default border; disabled or invalid states repaint both fill and border. */
  solid:
    "border-border-default bg-bg-surface has-[[data-disabled]]:border-border-default has-[:disabled]:border-border-default has-[[data-disabled]]:bg-bg-subtle has-[:disabled]:bg-bg-subtle has-[[data-invalid]]:border-border-danger data-invalid:border-border-danger",
  /** The solid fill on the page background instead of a raised surface; the same disabled and invalid states. */
  "solid-on-page":
    "border-border-default bg-bg-default has-[[data-disabled]]:border-border-default has-[:disabled]:border-border-default has-[[data-disabled]]:bg-bg-subtle has-[:disabled]:bg-bg-subtle has-[[data-invalid]]:border-border-danger data-invalid:border-border-danger",
  /** The inner control: transparent, fills the remaining width, primary text, placeholder and disabled colours. */
  text: "min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder disabled:cursor-not-allowed disabled:text-text-disabled",
} as const;

/**
 * Figma `Input` (58:126): SM, MD and LG, on Glass or Solid surface.
 *
 * A bordered box around Base UI's input: render the box, then the optional leading icon, then the native
 * `<input>`, which takes the remaining width. Focus is drawn on the box (`:focus-within`), so the ring never
 * detaches from the field. `invalid` marks both the box (`data-invalid`) and the input (`aria-invalid`); a
 * `Field` that reports invalid does the same through Base UI. Every other prop (`value`, `onChange`,
 * `placeholder`, `disabled`, `type`, …) goes to the native input, while `className`/`inputClassName` split
 * between the box and the input itself.
 *
 * @example
 * ```tsx
 * import { MagnifyingGlass } from "@phosphor-icons/react";
 * import { Input } from "@horon-ai/react";
 *
 * function Search() {
 *   return (
 *     <Input
 *       type="search"
 *       size="md"
 *       icon={<MagnifyingGlass />}
 *       placeholder="Search agents"
 *       aria-label="Search agents"
 *     />
 *   );
 * }
 * ```
 */
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
