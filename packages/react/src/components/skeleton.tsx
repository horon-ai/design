import type { ComponentProps } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type SkeletonProps = Omit<ComponentProps<"div">, "className"> & {
  /** `block` has the Figma 6px radius, `pill` is fully round (avatars, buttons). */
  shape?: "block" | "pill";
  className?: string;
};

/** A 7% ink placeholder; size it with classes. */
export function Skeleton({ shape = "block", className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer bg-overlay-ink-7 bg-[linear-gradient(90deg,transparent_30%,rgba(255,255,255,0.4)_50%,transparent_70%)] bg-size-[200%_100%] dark:bg-[linear-gradient(90deg,transparent_30%,rgba(255,255,255,0.06)_50%,transparent_70%)]",
        shape === "pill" ? "rounded-full" : "rounded-xs",
        className,
      )}
      {...props}
    />
  );
}

export type SkeletonCardProps = { type?: "row" | "card" | "text"; className?: string };

/** Figma `Skeleton` (in Loading 109:733): Row, Card and Text placeholders on a thick-glass card. */
export function SkeletonCard({ type = "row", className }: SkeletonCardProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "relative flex gap-2.5 overflow-clip rounded-[16px] bg-glass-thick p-3.5",
        type === "row" ? "w-75 items-center" : "w-70 flex-col items-start",
        className,
      )}
    >
      <LiquidGlass tier="thick" />
      {type === "row" && (
        <>
          <Skeleton shape="pill" className="relative size-9 shrink-0" />
          <div className="relative flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-2.5 w-35" />
            <Skeleton className="h-2 w-50" />
          </div>
        </>
      )}
      {type === "card" && (
        <>
          <Skeleton className="relative h-3 w-30" />
          <Skeleton className="relative h-2 w-63" />
          <Skeleton className="relative h-2 w-55" />
          <Skeleton className="relative h-2 w-40" />
          <Skeleton shape="pill" className="relative h-7 w-20" />
        </>
      )}
      {type === "text" && (
        <>
          <Skeleton className="relative h-2 w-63" />
          <Skeleton className="relative h-2 w-59" />
          <Skeleton className="relative h-2 w-45" />
        </>
      )}
    </div>
  );
}
