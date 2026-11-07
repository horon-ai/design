import type { ComponentProps } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

/**
 * Props for {@link Skeleton}. Other `div` props (`style`, `data-*`) land on the placeholder.
 */
export type SkeletonProps = Omit<ComponentProps<"div">, "className"> & {
  /**
   * `block` has the Figma 6px radius, `pill` is fully round (avatars, buttons).
   * @default "block"
   */
  shape?: "block" | "pill";
  /** Classes that give the placeholder its size, such as `h-2 w-40`. */
  className?: string;
};

/**
 * A 7% ink placeholder; size it with classes.
 *
 * The block is `aria-hidden` and shimmers with a translucent highlight, so it shows layout while
 * content loads without being read out.
 *
 * @example
 * ```tsx
 * import { Skeleton } from "@horon-ai/react";
 *
 * function Example() {
 *   return (
 *     <div className="flex items-center gap-3">
 *       <Skeleton shape="pill" className="size-9" />
 *       <Skeleton className="h-3 w-48" />
 *     </div>
 *   );
 * }
 * ```
 */
export function Skeleton({ shape = "block", className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer bg-overlay-ink-7 bg-[linear-gradient(90deg,transparent_30%,rgba(255,255,255,0.4)_50%,transparent_70%)] bg-size-[200%_100%] bg-no-repeat dark:bg-[linear-gradient(90deg,transparent_30%,rgba(255,255,255,0.06)_50%,transparent_70%)]",
        shape === "pill" ? "rounded-full" : "rounded-xs",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Props for {@link SkeletonCard}.
 */
export type SkeletonCardProps = {
  /**
   * Placeholder arrangement: `row` an avatar with two lines, `card` a heading, three lines and a
   * button, `text` three lines only.
   * @default "row"
   */
  type?: "row" | "card" | "text";
  /**
   * `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass card.
   * @default "solid"
   */
  surface?: "solid" | "glass";
  /** Classes merged onto the card. */
  className?: string;
};

/**
 * Figma `Skeleton` (in Loading 109:733): Row, Card and Text placeholders on a solid or thick-glass card.
 *
 * Use it while a list, a detail card or a paragraph loads. The card announces itself once with
 * `role="status"` and the label "Loading"; the individual bars stay hidden from assistive tech.
 *
 * @example
 * ```tsx
 * import { SkeletonCard } from "@horon-ai/react";
 *
 * function Example() {
 *   return (
 *     <div className="flex flex-col gap-3">
 *       <SkeletonCard />
 *       <SkeletonCard type="text" />
 *     </div>
 *   );
 * }
 * ```
 */
export function SkeletonCard({ type = "row", surface = "solid", className }: SkeletonCardProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "relative flex gap-3 overflow-clip rounded-xl p-4",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        type === "row" ? "w-75 max-w-full items-center" : "w-70 max-w-full flex-col items-start",
        className,
      )}
    >
      {surface === "glass" && <LiquidGlass />}
      {type === "row" && (
        <>
          <Skeleton shape="pill" className="relative size-9 shrink-0" />
          <div className="relative flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-2.5 w-35 max-sm:max-w-full" />
            <Skeleton className="h-2 w-50 max-sm:max-w-full" />
          </div>
        </>
      )}
      {type === "card" && (
        <>
          <Skeleton className="relative h-3 w-30 max-sm:max-w-full" />
          <Skeleton className="relative h-2 w-62 max-sm:max-w-full" />
          <Skeleton className="relative h-2 w-55 max-sm:max-w-full" />
          <Skeleton className="relative h-2 w-40 max-sm:max-w-full" />
          <Skeleton shape="pill" className="relative h-7 w-20 max-sm:max-w-full" />
        </>
      )}
      {type === "text" && (
        <>
          <Skeleton className="relative h-2 w-62 max-sm:max-w-full" />
          <Skeleton className="relative h-2 w-59 max-sm:max-w-full" />
          <Skeleton className="relative h-2 w-45 max-sm:max-w-full" />
        </>
      )}
    </div>
  );
}
