import type { ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { cn } from "../lib/cn";
import { Icon } from "../icons";
import { LiquidGlass } from "./liquid-glass";

/** Material of the chat controls: `solid` on raised surfaces, `glass` over imagery and glass panels. */
export type ChatControlSurface = "solid" | "glass";

/**
 * The native surface React spread onto a `button`. Lynx has no button element, so
 * the members a caller uses are declared here and forwarded to the `view` that
 * draws the control.
 */
type ButtonProps = {
  /** Runs when the control is tapped; a disabled control never runs it. */
  onClick?: () => void;
  /** Blocks interaction, dims the control to 40% and announces it as disabled. */
  disabled?: boolean;
  /** Kept for call-site parity. Lynx has no form submission, so it is inert. */
  type?: "button" | "submit" | "reset";
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the control's own. */
  style?: CSSProperties;
  /** Accessible name; the control has no visible text. */
  "aria-label"?: string;
  /** Extra classes merged onto the control button. */
  className?: string;
  /**
   * `solid` (default) on raised surfaces, `glass` over imagery and glass panels.
   * @default "solid"
   */
  surface?: ChatControlSurface;
};

const controlBase =
  "motion-press relative flex motion-rise flex-row cursor-pointer items-center overflow-hidden rounded-full text-text-primary select-none";

/** Lynx has no hover, so React's hover fill is dropped and only the pressed fill stays. */
const surfaceClass: Record<ChatControlSurface, string> = {
  glass: "bg-glass-clear active:bg-glass-clear-pressed",
  solid: "border border-border-default bg-bg-surface active:bg-interactive-secondary-hover",
};

/**
 * Figma `Jump to latest` (Chat controls 88:659): a 44px clear-glass circle with a 20px caret.
 *
 * A square icon button with `aria-label` (default `"Jump to latest"`) that surfaces with the
 * `motion-rise` entrance and forwards `onClick`; the caller's handler performs the scroll to the
 * newest message. Lynx has no button element, so the circle is a `view` announced with the button
 * trait, and the caret is the same 20px `CaretDown` glyph react drew.
 *
 * @example
 * ```tsx
 * import { JumpToLatest } from "@horon-ai/lynx";
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
  onClick,
  disabled = false,
  type: _type,
  id,
  style,
}: ButtonProps) {
  return (
    <view
      className={cn(
        controlBase,
        surfaceClass[surface],
        "size-11 shrink-0 justify-center",
        disabled ? "opacity-40" : "",
        className,
      )}
      style={style}
      hit-slop="2px"
      bindtap={disabled ? undefined : onClick}
      accessibility-element
      accessibility-traits={disabled ? "disabled" : "button"}
      accessibility-label={ariaLabel}
      accessibility-role-description="button"
      {...(id === undefined ? {} : { id })}
    >
      {surface === "glass" && <LiquidGlass />}
      <view className="relative flex flex-row items-center">
        <Icon name="CaretDown" size={20} color="text-primary" />
      </view>
    </view>
  );
}

/**
 * Figma `New messages` (88:659): a 40px clear-glass pill with a 16px caret and a label.
 *
 * A peer of {@link JumpToLatest} for the "there are unread messages above" case; the child is the label
 * and all button attributes are forwarded.
 *
 * @example
 * ```tsx
 * import { NewMessagesPill } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return <NewMessagesPill onClick={() => scrollToLatest()}>3 new messages</NewMessagesPill>;
 * }
 * ```
 */
export function NewMessagesPill({
  surface = "solid",
  className,
  onClick,
  disabled = false,
  type: _type,
  id,
  style,
  children,
}: ButtonProps & { children?: ReactNode }) {
  return (
    <view
      className={cn(
        controlBase,
        surfaceClass[surface],
        "h-10 shrink-0 gap-1.5 pr-4 pl-3.5",
        disabled ? "opacity-40" : "",
        className,
      )}
      style={style}
      hit-slop="2px"
      bindtap={disabled ? undefined : onClick}
      accessibility-element
      accessibility-traits={disabled ? "disabled" : "button"}
      accessibility-role-description="button"
      {...(id === undefined ? {} : { id })}
    >
      {surface === "glass" && <LiquidGlass />}
      <view className="relative flex flex-row items-center">
        <Icon name="CaretDown" size={16} color="text-primary" />
      </view>
      <text className="relative whitespace-nowrap text-label-md text-text-primary">{children}</text>
    </view>
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
 * 4–28px bar. With `recording` the bars run the `wave-level` keyframes on a 120ms stagger; the whole
 * waveform is hidden from assistive technology, so only the stop button and the elapsed text reach it.
 * Lynx has no `animate-wave` token, so the same animation is written inline on each bar.
 *
 * @example
 * ```tsx
 * import { VoiceInput } from "@horon-ai/lynx";
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
    <view
      className={cn(
        "relative flex h-[52px] w-60 max-w-full min-w-0 flex-row items-center gap-3 overflow-hidden rounded-full px-2",
        surface === "glass" ? "bg-glass-regular" : "border border-border-default bg-bg-surface",
        className,
      )}
    >
      {surface === "glass" && <LiquidGlass />}
      <view
        className="relative flex size-9 shrink-0 flex-row items-center justify-center rounded-full bg-interactive-danger motion-press cursor-pointer"
        hit-slop="2px"
        bindtap={onStop}
        accessibility-element
        accessibility-traits="button"
        accessibility-label={stopLabel}
        accessibility-role-description="button"
      >
        <view className="size-3 rounded-[3px] bg-interactive-on-danger" accessibility-element={false} />
      </view>
      <view className="relative flex min-w-0 flex-1 flex-row items-center gap-[3px] overflow-hidden" accessibility-element={false}>
        {bars.map((bar, position) => (
          <view
            key={bar.id}
            className="w-[3px] shrink-0 rounded-[2px] bg-interactive-primary-75"
            style={{
              height: `${bar.height}px`,
              ...(recording
                ? {
                    animationName: "wave-level",
                    animationDuration: "900ms",
                    animationTimingFunction: "ease-in-out",
                    animationIterationCount: "infinite",
                    animationDelay: `${position * 120}ms`,
                  }
                : {}),
            }}
            accessibility-element={false}
          />
        ))}
      </view>
      <text className="relative w-10 shrink-0 text-right text-label-md whitespace-nowrap text-text-secondary">
        {elapsed}
      </text>
    </view>
  );
}
