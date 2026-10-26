import { CaretDown } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

type ButtonProps = Omit<ComponentProps<"button">, "className"> & { className?: string };

const clearGlass =
  "relative flex cursor-pointer items-center overflow-clip rounded-full border border-glass-rim-strong bg-glass-clear text-text-primary hover:bg-glass-clear-hover active:bg-glass-clear-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand";

/** Figma `Jump to latest` (Chat controls 88:659): a 44px clear-glass circle with a 20px caret. */
export function JumpToLatest({ className, "aria-label": ariaLabel = "Jump to latest", ...props }: ButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(clearGlass, "size-11 justify-center", className)}
      {...props}
    >
      <LiquidGlass />
      <CaretDown aria-hidden className="relative size-5" />
    </button>
  );
}

/** Figma `New messages` (88:659): a 40px clear-glass pill with a 16px caret and a label. */
export function NewMessagesPill({ className, children, ...props }: ButtonProps) {
  return (
    <button type="button" className={cn(clearGlass, "h-10 gap-1.5 pr-4 pl-3.5 text-label-md", className)} {...props}>
      <LiquidGlass />
      <CaretDown aria-hidden className="relative size-4" />
      <span className="relative whitespace-nowrap">{children}</span>
    </button>
  );
}

/** Bar heights of the Figma waveform, in px. */
const WAVEFORM = [8, 14, 22, 12, 26, 18, 10, 20, 28, 16, 9, 18, 24, 12, 7, 15, 21, 11];

export type VoiceInputProps = {
  /** Elapsed time, such as "0:07". */
  elapsed: ReactNode;
  /** 0-1 levels for the 18 bars; defaults to the Figma waveform. */
  levels?: number[];
  onStop?: () => void;
  stopLabel?: string;
  className?: string;
};

/** Figma `Voice input` (88:659): a 52px regular-glass pill with a red stop button, waveform and timer. */
export function VoiceInput({ elapsed, levels, onStop, stopLabel = "Stop recording", className }: VoiceInputProps) {
  const heights = levels ? levels.map((level) => Math.max(4, Math.round(level * 28))) : WAVEFORM;
  const bars = heights.map((height, position) => ({ height, id: `bar-${position}` }));
  return (
    <div
      className={cn(
        "relative flex h-13 w-60 items-center gap-3 overflow-clip rounded-full border border-glass-rim-strong bg-glass-regular px-2",
        className,
      )}
    >
      <LiquidGlass tier="regular" />
      <button
        type="button"
        aria-label={stopLabel}
        onClick={onStop}
        className="relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
      >
        <span className="size-3 rounded-[3px] bg-bg-surface" />
      </button>
      <div aria-hidden className="relative flex min-w-0 flex-1 items-center gap-[3px] overflow-hidden">
        {bars.map((bar) => (
          <span
            key={bar.id}
            className="w-[3px] shrink-0 rounded-[2px] bg-interactive-primary-75"
            style={{ height: bar.height }}
          />
        ))}
      </div>
      <span className="relative shrink-0 text-label-md whitespace-nowrap text-text-secondary">{elapsed}</span>
    </div>
  );
}
