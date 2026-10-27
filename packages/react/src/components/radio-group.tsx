import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";

export type RadioGroupProps = Omit<ComponentProps<typeof BaseRadioGroup>, "className"> & { className?: string };

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return <BaseRadioGroup className={cn("flex flex-col gap-3", className)} {...props} />;
}

export type RadioProps = Omit<ComponentProps<typeof BaseRadio.Root>, "className"> & {
  label?: ReactNode;
  className?: string;
};

/** Figma `Radio` (58:239): a 20px circle; checked fills with ink and an 8px dot. */
export function Radio({ label, className, ...props }: RadioProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2.5 text-body-md text-text-primary has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-40",
        className,
      )}
    >
      <BaseRadio.Root
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-border-strong bg-bg-surface motion-colors",
          "hover:not-data-disabled:border-text-secondary",
          "data-checked:border-0 data-checked:bg-interactive-primary hover:not-data-disabled:data-checked:bg-interactive-primary-hover",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
        )}
        {...props}
      >
        <BaseRadio.Indicator className="size-2 animate-pop-in rounded-full bg-interactive-on-primary data-unchecked:hidden" />
      </BaseRadio.Root>
      {label}
    </label>
  );
}
