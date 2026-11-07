import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check, Minus } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/** Box size of {@link Checkbox}; identical to {@link ControlSize}. */
export type CheckboxSize = ControlSize;

/** Props of {@link Checkbox}. */
export type CheckboxProps = Omit<ComponentProps<typeof BaseCheckbox.Root>, "className"> & {
  /** Label rendered after the box inside the same clickable `<label>`. */
  label?: ReactNode;
  /**
   * `md` is the 20px Figma Checkbox, `sm` the 18px box of the Data table (192:9046),
   * `lg` the 24px box.
   * @default "md"
   */
  size?: CheckboxSize;
  /** Extra classes merged onto the label wrapper. */
  className?: string;
};

const labelClass: Record<CheckboxSize, string> = {
  sm: "gap-2 text-body-sm",
  md: "gap-2.5 text-body-md",
  lg: "gap-3 text-body-lg",
};

/** One 6px corner (`rounded-xs`, the Figma radius) at every size; only the box grows with the rung. */
const boxClass: Record<CheckboxSize, string> = {
  sm: "size-4.5 rounded-xs",
  md: "size-5 rounded-xs",
  lg: "size-6 rounded-xs",
};

const indicatorClass: Record<CheckboxSize, string> = {
  sm: "[&_svg]:size-3",
  md: "[&_svg]:size-3.5",
  lg: "[&_svg]:size-4",
};

/**
 * Figma `Checkbox` (58:217): a 20px box, 6px radius, with a 10px gap to its label.
 *
 * A Base UI checkbox: `checked` makes it controlled, otherwise it keeps its own state, and
 * `defaultChecked` / `onCheckedChange` / `indeterminate` work as in Base UI. Checked and indeterminate
 * boxes fill with the brand color and show a check or a dash; the wrapper `<label>` dims the whole control
 * when the input is disabled.
 *
 * @example
 * ```tsx
 * import { Checkbox } from "@horon-ai/react";
 *
 * function Example() {
 *   return <Checkbox label="Remember this chat" defaultChecked />;
 * }
 * ```
 */
export function Checkbox({ label, size = "md", className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "group inline-flex max-w-full min-w-0 cursor-pointer items-center text-text-primary has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-40",
        labelClass[size],
        className,
      )}
    >
      <BaseCheckbox.Root
        className={cn(
          "flex shrink-0 items-center justify-center border-[1.5px] border-border-strong bg-bg-surface motion-colors",
          boxClass[size],
          "hover:not-data-disabled:border-text-secondary",
          "data-checked:border-interactive-primary data-checked:bg-interactive-primary data-indeterminate:border-interactive-primary data-indeterminate:bg-interactive-primary",
          "hover:not-data-disabled:data-checked:border-interactive-primary-hover hover:not-data-disabled:data-checked:bg-interactive-primary-hover hover:not-data-disabled:data-indeterminate:border-interactive-primary-hover hover:not-data-disabled:data-indeterminate:bg-interactive-primary-hover",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
        )}
        {...props}
      >
        <BaseCheckbox.Indicator
          className={cn(
            "flex animate-pop-in text-interactive-on-primary data-ending-style:animate-scale-out",
            indicatorClass[size],
          )}
          render={(indicatorProps, state) => (
            <span {...indicatorProps}>{state.indeterminate ? <Minus /> : <Check />}</span>
          )}
        />
      </BaseCheckbox.Root>
      {label}
    </label>
  );
}
