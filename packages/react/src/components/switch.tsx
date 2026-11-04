import { Switch as BaseSwitch } from "@base-ui/react/switch";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/** `compact` is the 40x24 Paper bot-memory switch and keeps its own rung. */
export type SwitchSize = ControlSize | "compact";

export type SwitchProps = Omit<ComponentProps<typeof BaseSwitch.Root>, "className"> & {
  size?: SwitchSize;
  label?: ReactNode;
  className?: string;
};

const trackClass: Record<SwitchSize, string> = {
  sm: "h-5 w-8 p-0.5",
  md: "h-6.5 w-11 p-0.5",
  lg: "h-7.5 w-13 p-0.5",
  compact: "h-6 w-10 p-[3px]",
};

const thumbClass: Record<SwitchSize, string> = {
  sm: "size-4 data-checked:translate-x-3",
  md: "size-5.5 data-checked:translate-x-4.5",
  lg: "size-6.5 data-checked:translate-x-5.5",
  compact: "size-[18px] data-checked:translate-x-4",
};

const labelClass: Record<SwitchSize, string> = {
  sm: "gap-3 text-body-sm",
  md: "gap-4 text-body-md",
  lg: "gap-4 text-body-lg",
  compact: "gap-3 text-body-sm",
};

/**
 * Switch: MD 44x26 and SM 32x20 tracks with a white thumb 2px in; LG is 52x30; COMPACT 40x24 with an
 * 18px thumb 3px in (Paper bot memory). The thumb stays white on the grey track in both themes and
 * takes the inverse of the ink fill when checked, so the checked state reads the same in dark.
 */
export function Switch({ size = "md", label, className, ...props }: SwitchProps) {
  const control = (
    <BaseSwitch.Root
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full bg-border-strong motion-colors",
        "hover:not-data-disabled:bg-interactive-secondary-hover data-checked:bg-interactive-primary hover:not-data-disabled:data-checked:bg-interactive-primary-hover",
        "data-disabled:cursor-not-allowed data-disabled:opacity-40",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
        trackClass[size],
        label ? undefined : className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        className={cn(
          // The thumb is a flex child of a fixed-width track whose content box can be
          // narrower than the thumb plus its travel; `shrink-0` holds it at its own
          // size so the track never reads as a bare bar.
          "shrink-0 rounded-full bg-text-on-ink transition-[translate,background-color] duration-220 ease-spring data-checked:bg-interactive-on-primary",
          thumbClass[size],
        )}
      />
    </BaseSwitch.Root>
  );
  if (!label) return control;
  return (
    <label className={cn("inline-flex cursor-pointer items-center text-text-primary", labelClass[size], className)}>
      <span className="min-w-0 flex-1">{label}</span>
      {control}
    </label>
  );
}
