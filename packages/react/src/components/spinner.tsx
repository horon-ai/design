import { cn } from "../lib/cn";

/**
 * Named spinner rungs, in 14/16/24/32px (`xs`, `sm`, `md`, `lg`); a raw number is also
 * accepted for one-off sizes.
 */
export type SpinnerSize = "xs" | "sm" | "md" | "lg";

/** Props of {@link Spinner}: a rung or pixel size, the accessible label, and extra classes. */
export type SpinnerProps = {
  /** Named size, or a pixel size for the one-off spinners in agent rows (12, 15, 20). @default "sm" */
  size?: SpinnerSize | number;
  /** Accessible name announced while spinning (`role="status"`). @default "Loading" */
  label?: string;
  /** Extra classes on the `<svg>`; `animate-spin` and `shrink-0` are always applied. */
  className?: string;
};

const sizeClass: Record<SpinnerSize, string> = { xs: "size-3.5", sm: "size-4", md: "size-6", lg: "size-8" };

/**
 * Figma `Spinner` (Loading 109:733): a 10% ink ring with a quarter ink arc, 11% stroke.
 *
 * Sizes are fixed pixel rungs (`xs` 14px, `sm` 16px, `md` 24px, `lg` 32px) or a raw number;
 * it never shrinks, spins for as long as it is mounted, and announces `label` through
 * `role="status"`.
 *
 * @example
 * ```tsx
 * import { Spinner } from "@horon-ai/react";
 *
 * function Saving() {
 *   return (
 *     <span className="flex items-center gap-2 text-text-secondary">
 *       <Spinner size="sm" label="Saving" />
 *       Saving
 *     </span>
 *   );
 * }
 * ```
 */
export function Spinner({ size = "sm", label = "Loading", className }: SpinnerProps) {
  return (
    <svg
      role="status"
      aria-label={label}
      viewBox="0 0 100 100"
      width={typeof size === "number" ? size : undefined}
      height={typeof size === "number" ? size : undefined}
      className={cn("shrink-0 animate-spin", typeof size === "number" ? undefined : sizeClass[size], className)}
    >
      <circle cx="50" cy="50" r="44.5" fill="none" strokeWidth="11" className="stroke-overlay-ink-10" />
      <path d="M50 5.5A44.5 44.5 0 0 1 94.5 50" fill="none" strokeWidth="11" className="stroke-interactive-primary" />
    </svg>
  );
}
