import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check, Minus } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";

export type CheckboxProps = Omit<ComponentProps<typeof BaseCheckbox.Root>, "className"> & {
  label?: ReactNode;
  /** `md` is the 20px Figma Checkbox, `sm` the 18px box of the Data table (192:9046). */
  size?: "sm" | "md";
  className?: string;
};

/** Figma `Checkbox` (58:217): a 20px box, 6px radius, with a 10px gap to its label. */
export function Checkbox({ label, size = "md", className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "group inline-flex cursor-pointer items-center gap-2.5 text-body-md text-text-primary has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-40",
        className,
      )}
    >
      <BaseCheckbox.Root
        className={cn(
          "flex shrink-0 items-center justify-center border-[1.5px] border-border-strong bg-bg-surface",
          size === "sm" ? "size-4.5 rounded-[5px]" : "size-5 rounded-xs",
          "hover:not-data-disabled:border-text-secondary",
          "data-checked:border-0 data-checked:bg-interactive-primary data-indeterminate:border-0 data-indeterminate:bg-interactive-primary",
          "hover:not-data-disabled:data-checked:bg-interactive-primary-hover hover:not-data-disabled:data-indeterminate:bg-interactive-primary-hover",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
        )}
        {...props}
      >
        <BaseCheckbox.Indicator
          className="flex text-interactive-on-primary [&_svg]:size-3.5"
          render={(indicatorProps, state) => (
            <span {...indicatorProps}>{state.indeterminate ? <Minus /> : <Check />}</span>
          )}
        />
      </BaseCheckbox.Root>
      {label}
    </label>
  );
}
