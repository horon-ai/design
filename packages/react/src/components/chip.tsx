import { Toggle } from "@base-ui/react/toggle";
import { Check } from "@phosphor-icons/react";
import type { ComponentProps } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type ChipProps = Omit<ComponentProps<typeof Toggle>, "className"> & { className?: string };

/** Figma `Chip` (61:302): a 32px clear-glass toggle; selected shows a check and the brand rim. */
export function Chip({ className, children, ...props }: ChipProps) {
  return (
    <Toggle
      className={cn(
        "group relative inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 overflow-clip rounded-full border px-3 text-label-md whitespace-nowrap",
        "border-glass-rim-strong bg-glass-clear text-text-primary hover:not-data-disabled:bg-glass-clear-hover",
        "data-pressed:border-border-brand data-pressed:bg-glass-clear-pressed data-pressed:text-text-brand hover:not-data-disabled:data-pressed:bg-glass-clear-pressed",
        "data-disabled:cursor-not-allowed data-disabled:opacity-40",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    >
      <LiquidGlass />
      <Check aria-hidden className="relative hidden size-3.5 group-data-pressed:block" />
      <span className="relative">{children}</span>
    </Toggle>
  );
}
