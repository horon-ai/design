import { Slider as BaseSlider } from "@base-ui/react/slider";
import type { ComponentProps } from "react";

import { cn } from "../lib/cn";

/**
 * Props of {@link Slider}: every Base UI `Slider.Root` prop (`value`, `defaultValue`,
 * `onValueChange`, `min`, `max`, `step`, `disabled`, `orientation`) plus the two overrides below.
 */
export type SliderProps = Omit<ComponentProps<typeof BaseSlider.Root>, "className" | "children"> & {
  /** Extra classes for the root, which is 220px wide (`w-55`) and caps at its container by default. */
  className?: string;
  /** Accessible name of the thumb, the only focusable part of the control. */
  "aria-label"?: string;
};

/**
 * Paper settings slider (Voice / Speed): a 20px control, 6px track at 8% ink with an ink fill,
 * and an 18px white thumb with a 1px hairline and a 0 1 3 12% shadow. Width comes from the caller.
 *
 * Wraps Base UI's slider: the whole 20px row is draggable and clickable, the thumb is the
 * focusable element (focus ring on `text-brand`, it scales up on hover and press), and a
 * disabled slider dims to 40% with a not-allowed cursor.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { Slider } from "@horon-ai/react";
 *
 * function VoiceSpeed() {
 *   const [speed, setSpeed] = useState(1);
 *   return (
 *     <Slider
 *       aria-label="Voice speed"
 *       min={0.5}
 *       max={2}
 *       step={0.1}
 *       value={speed}
 *       onValueChange={(next) => setSpeed(next as number)}
 *     />
 *   );
 * }
 * ```
 */
export function Slider({ className, "aria-label": ariaLabel, ...props }: SliderProps) {
  return (
    <BaseSlider.Root className={cn("relative w-55 max-w-full", className)} {...props}>
      <BaseSlider.Control className="flex h-5 w-full cursor-pointer touch-none items-center select-none data-disabled:cursor-not-allowed data-disabled:opacity-40">
        <BaseSlider.Track className="relative h-1.5 w-full rounded-full bg-overlay-ink-8">
          <BaseSlider.Indicator className="rounded-full bg-interactive-primary" />
          <BaseSlider.Thumb
            aria-label={ariaLabel}
            className="size-[18px] cursor-grab rounded-full border border-border-default bg-bg-default shadow-[0_1px_3px_#0000001f] transition-[scale,box-shadow] duration-120 ease-out-quint hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand active:scale-110"
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
