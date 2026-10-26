import { cn } from "../lib/cn";

export type SpinnerSize = "xs" | "sm" | "md" | "lg";

export type SpinnerProps = {
  /** Named size, or a pixel size for the one-off spinners in agent rows (12, 15, 20). */
  size?: SpinnerSize | number;
  label?: string;
  className?: string;
};

const sizeClass: Record<SpinnerSize, string> = { xs: "size-3.5", sm: "size-4", md: "size-6", lg: "size-8" };

/** Figma `Spinner` (Loading 109:733): a 10% ink ring with a quarter ink arc, 11% stroke. */
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
