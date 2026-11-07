import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { type ComponentProps, createContext, type ReactNode, useContext } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/**
 * Mark size of a radio, on the shared control scale: `sm` 16px, `md` 20px, `lg` 24px.
 * The group sets it once for every radio inside.
 */
export type RadioSize = ControlSize;

/** The group owns the size: every radio in one list reads the same mark. */
const RadioSizeContext = createContext<ControlSize>("md");

/** Props for {@link RadioGroup}; Base UI `RadioGroup` props such as `value`, `defaultValue`, `onValueChange` and `name` pass through. */
export type RadioGroupProps = Omit<ComponentProps<typeof BaseRadioGroup>, "className"> & {
  /**
   * Mark size for every `Radio` inside; a radio can still override it.
   * @default "md"
   */
  size?: RadioSize;
  /** Classes merged onto the group column, which stacks radios 12px apart. */
  className?: string;
};

/**
 * Groups {@link Radio} items so only one can be selected, and shares one mark size with all of
 * them. It renders a vertical flex column with a 12px gap and forwards its selection props to
 * Base UI's radio group (keyboard roving included).
 *
 * @example
 * ```tsx
 * import { Radio, RadioGroup } from "@horon-ai/react";
 *
 * function Example() {
 *   return (
 *     <RadioGroup defaultValue="week" aria-label="Repeat">
 *       <Radio value="day" label="Every day" />
 *       <Radio value="week" label="Every week" />
 *     </RadioGroup>
 *   );
 * }
 * ```
 */
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

/**
 * Props for {@link Radio}; remaining Base UI `Radio.Root` props (`value`, `disabled`,
 * `required`) pass through.
 */
export type RadioProps = Omit<ComponentProps<typeof BaseRadio.Root>, "className"> & {
  /** Text or node after the mark; clicking it toggles the radio because both sit in one label. */
  label?: ReactNode;
  /** Overrides the enclosing `RadioGroup` size. */
  size?: RadioSize;
  /** Classes merged onto the wrapping label. */
  className?: string;
};

/**
 * Figma `Radio` (58:239): a 20px circle; checked fills with ink and an 8px dot.
 *
 * The mark and the label share one `<label>`, so the label text is a click target and the mark
 * takes focus from the group's keyboard roving. The dot pops in on check and scales out on uncheck.
 *
 * @example
 * ```tsx
 * import { Radio, RadioGroup } from "@horon-ai/react";
 *
 * function Example() {
 *   return (
 *     <RadioGroup size="sm" defaultValue="one" aria-label="Priority">
 *       <Radio value="one" label="Low" />
 *       <Radio value="two" label="High" />
 *     </RadioGroup>
 *   );
 * }
 * ```
 */
export function Radio({ label, size, className, ...props }: RadioProps) {
  const groupSize = useContext(RadioSizeContext);
  const resolvedSize = size ?? groupSize;
  return (
    <label
      className={cn(
        "inline-flex max-w-full min-w-0 cursor-pointer items-center text-text-primary has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-40",
        labelClass[resolvedSize],
        className,
      )}
    >
      <BaseRadio.Root
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border-[1.5px] border-border-strong bg-bg-surface motion-colors",
          circleClass[resolvedSize],
          "hover:not-data-disabled:border-text-secondary",
          "data-checked:border-interactive-primary data-checked:bg-interactive-primary hover:not-data-disabled:data-checked:border-interactive-primary-hover hover:not-data-disabled:data-checked:bg-interactive-primary-hover",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
        )}
        {...props}
      >
        <BaseRadio.Indicator
          className={cn(
            "animate-pop-in rounded-full bg-interactive-on-primary data-ending-style:animate-scale-out",
            dotClass[resolvedSize],
          )}
        />
      </BaseRadio.Root>
      {label}
    </label>
  );
}
