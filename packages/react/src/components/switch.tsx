import { Switch as BaseSwitch } from "@base-ui/react/switch";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";

export type SwitchSize = "sm" | "md";

export type SwitchProps = Omit<ComponentProps<typeof BaseSwitch.Root>, "className"> & {
  size?: SwitchSize;
  label?: ReactNode;
  className?: string;
};

const trackClass: Record<SwitchSize, string> = {
  md: "h-6.5 w-11 p-0.5",
  sm: "h-5 w-8 p-0.5",
};

const thumbClass: Record<SwitchSize, string> = {
  md: "size-5.5 data-checked:translate-x-4.5",
  sm: "size-4 data-checked:translate-x-3",
};

/** Figma `Switch` (58:264): MD 44x26 and SM 32x20 tracks with a white thumb 2px in. */
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
          "rounded-full bg-text-on-ink transition-[translate,background-color] duration-220 ease-spring data-checked:bg-interactive-on-primary",
          thumbClass[size],
        )}
      />
    </BaseSwitch.Root>
  );
  if (!label) return control;
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-4 text-body-md text-text-primary", className)}>
      <span className="min-w-0 flex-1">{label}</span>
      {control}
    </label>
  );
}
