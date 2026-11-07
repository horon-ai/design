import { CaretDown } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

/** Material of the chat controls: `solid` on raised surfaces, `glass` over imagery and glass panels. */
export type ChatControlSurface = "solid" | "glass";

type ButtonProps = Omit<ComponentProps<"button">, "className"> & {
  /** Extra classes merged onto the control button. */
  className?: string;
  /**
   * `solid` (default) on raised surfaces, `glass` over imagery and glass panels.
   * @default "solid"
   */
  surface?: ChatControlSurface;
};

const controlBase =
  "motion-press relative flex motion-rise cursor-pointer items-center overflow-clip rounded-full text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand";

const surfaceClass: Record<ChatControlSurface, string> = {
  glass: "bg-glass-clear hover:bg-glass-clear-hover active:bg-glass-clear-pressed",
  solid: "border border-border-default bg-bg-surface hover:bg-bg-subtle active:bg-interactive-secondary-hover",
};

/**
 * Figma `Jump to latest` (Chat controls 88:659): a 44px clear-glass circle with a 20px caret.
 *
 * A square icon button with `aria-label` (default `"Jump to latest"`) that surfaces with the
 * `motion-rise` entrance and forwards `onClick`; the caller's handler performs the scroll to the
 * newest message.
 *
 * @example
 * ```tsx
 * import { JumpToLatest } from "@horon-ai/react";
 *
 * function Example() {
 *   return <JumpToLatest surface="glass" onClick={() => scrollToLatest()} />;
 * }
 * ```
 */
export function JumpToLatest({
  surface = "solid",
  className,
  "aria-label": ariaLabel = "Jump to latest",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(controlBase, surfaceClass[surface], "size-11 justify-center", className)}
      {...props}
    >
      {surface === "glass" && <LiquidGlass />}
      <CaretDown aria-hidden className="relative size-5" />
    </button>
  );
}

/**
 * Figma `New messages` (88:659): a 40px clear-glass pill with a 16px caret and a label.
 *
 * A peer of {@link JumpToLatest} for the "there are unread messages above" case; the child is the label
 * and all button attributes are forwarded.
 */
export function NewMessagesPill({ surface = "solid", className, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(controlBase, surfaceClass[surface], "h-10 gap-1.5 pr-4 pl-3.5 text-label-md", className)}
      {...props}
    >
      {surface === "glass" && <LiquidGlass />}
      <CaretDown aria-hidden className="relative size-4" />
      <span className="relative whitespace-nowrap">{children}</span>
    </button>
  );
}

/** Bar heights of the Figma waveform, in px. */
const WAVEFORM = [8, 14, 22, 12, 26, 18, 10, 20, 28, 16, 9, 18, 24, 12, 7, 15, 21, 11];

/** Props of {@link VoiceInput}. */
export type VoiceInputProps = {
  /** Elapsed time, such as "0:07". */
  elapsed: ReactNode;
  /** 0-1 levels for the 18 bars; defaults to the Figma waveform. Each level is scaled to 4–28px. */
  levels?: number[];
  /**
   * Animates the waveform while true; set false once recording stops.
   * @default true
   */
  recording?: boolean;
  /** Fires when the red stop button is pressed. */
  onStop?: () => void;
  /**
   * Accessible label of the stop button.
   * @default "Stop recording"
   */
  stopLabel?: string;
  /**
   * `solid` (default) on raised surfaces, `glass` over imagery and glass panels.
   * @default "solid"
   */
  surface?: ChatControlSurface;
  /** Extra classes merged onto the pill. */
  className?: string;
};

/**
 * Figma `Voice input` (88:659): a 52px pill with a red stop button, waveform and timer.
 *
 * The 18 bars keep the Figma heights unless `levels` is passed, in which case each 0-1 level maps to a
 * 4–28px bar. With `recording` the bars run the `wave` animation on a 120ms stagger; the whole waveform
 * is `aria-hidden`, so only the stop button and the elapsed text reach assistive technology.
 *
 * @example
 * ```tsx
 * import { VoiceInput } from "@horon-ai/react";
 *
 * function Example() {
 *   return <VoiceInput elapsed="0:07" recording onStop={() => stopRecording()} />;
 * }
 * ```
 */
export function VoiceInput({
  elapsed,
  levels,
  recording = true,
  onStop,
  stopLabel = "Stop recording",
  surface = "solid",
  className,
}: VoiceInputProps) {
  const heights = levels ? levels.map((level) => Math.max(4, Math.round(level * 28))) : WAVEFORM;
  const bars = heights.map((height, position) => ({ height, id: `bar-${position}` }));
  return (
    <div
      className={cn(
        "relative flex h-13 w-60 max-w-full min-w-0 items-center gap-3 overflow-clip rounded-full px-2",
        surface === "glass" ? "bg-glass-regular" : "border border-border-default bg-bg-surface",
        className,
      )}
    >
      {surface === "glass" && <LiquidGlass />}
      <button
        type="button"
        aria-label={stopLabel}
        onClick={onStop}
        className="relative flex size-9 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full bg-interactive-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
      >
        <span className="size-3 rounded-[3px] bg-interactive-on-danger" />
      </button>
      <div aria-hidden className="relative flex min-w-0 flex-1 items-center gap-[3px] overflow-hidden">
        {bars.map((bar, position) => (
          <span
            key={bar.id}
            className={cn("w-[3px] shrink-0 rounded-[2px] bg-interactive-primary-75", recording && "animate-wave")}
            style={{ height: bar.height, animationDelay: recording ? `${position * 120}ms` : undefined }}
          />
        ))}
      </div>
      <span className="relative w-10 shrink-0 text-right text-label-md whitespace-nowrap text-text-secondary tabular-nums">
        {elapsed}
      </span>
    </div>
  );
}
