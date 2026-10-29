import { Slider as BaseSlider } from "@base-ui/react/slider";
import type { ComponentProps } from "react";

import { cn } from "../lib/cn";

export type SliderProps = Omit<ComponentProps<typeof BaseSlider.Root>, "className" | "children"> & {
  className?: string;
  "aria-label"?: string;
};

/**
 * Paper settings slider (Voice / Speed): a 20px control, 6px track at 8% ink with an ink fill,
 * and an 18px white thumb with a 1px hairline and a 0 1 3 12% shadow. Width comes from the caller.
 */
export function Slider({ className, "aria-label": ariaLabel, ...props }: SliderProps) {
  return (
    <BaseSlider.Root className={cn("relative w-55", className)} {...props}>
      <BaseSlider.Control className="flex h-5 w-full cursor-pointer touch-none items-center select-none data-disabled:cursor-not-allowed data-disabled:opacity-40">
        <BaseSlider.Track className="relative h-1.5 w-full rounded-full bg-overlay-ink-8">
          <BaseSlider.Indicator className="rounded-full bg-interactive-primary" />
          <BaseSlider.Thumb
            aria-label={ariaLabel}
            className="size-[18px] rounded-full border border-border-default bg-bg-default shadow-[0_1px_3px_#0000001f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
