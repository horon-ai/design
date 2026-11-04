import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { type ComponentProps, createContext, type ReactNode, useContext } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

export type RadioSize = ControlSize;

/** The group owns the size: every radio in one list reads the same mark. */
const RadioSizeContext = createContext<ControlSize>("md");

export type RadioGroupProps = Omit<ComponentProps<typeof BaseRadioGroup>, "className"> & {
  /** Mark size for every `Radio` inside; a radio can still override it. */
  size?: RadioSize;
  className?: string;
};

export function RadioGroup({ size = "md", className, ...props }: RadioGroupProps) {
  return (
    <RadioSizeContext.Provider value={size}>
      <BaseRadioGroup className={cn("flex flex-col gap-3", className)} {...props} />
    </RadioSizeContext.Provider>
  );
}

const labelClass: Record<RadioSize, string> = {
  sm: "gap-2 text-body-sm",
  md: "gap-2.5 text-body-md",
  lg: "gap-3 text-body-lg",
};

const circleClass: Record<RadioSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const dotClass: Record<RadioSize, string> = {
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
};

export type RadioProps = Omit<ComponentProps<typeof BaseRadio.Root>, "className"> & {
  label?: ReactNode;
  /** Overrides the enclosing `RadioGroup` size. */
  size?: RadioSize;
  className?: string;
};

/** Figma `Radio` (58:239): a 20px circle; checked fills with ink and an 8px dot. */
export function Radio({ label, size, className, ...props }: RadioProps) {
  const groupSize = useContext(RadioSizeContext);
  const resolvedSize = size ?? groupSize;
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center text-text-primary has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-40",
        labelClass[resolvedSize],
        className,
      )}
    >
      <BaseRadio.Root
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border-[1.5px] border-border-strong bg-bg-surface motion-colors",
          circleClass[resolvedSize],
          "hover:not-data-disabled:border-text-secondary",
          "data-checked:border-0 data-checked:bg-interactive-primary hover:not-data-disabled:data-checked:bg-interactive-primary-hover",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
        )}
        {...props}
      >
        <BaseRadio.Indicator
          className={cn("animate-pop-in rounded-full bg-interactive-on-primary data-unchecked:hidden", dotClass[resolvedSize])}
        />
      </BaseRadio.Root>
      {label}
    </label>
  );
}
