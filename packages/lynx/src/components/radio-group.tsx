import { createContext, useContext, useMemo, useState, type ReactNode } from "@lynx-js/react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/**
 * Mark size of a radio, on the shared control scale: `sm` 16px, `md` 20px, `lg` 24px.
 * The group sets it once for every radio inside.
 */
export type RadioSize = ControlSize;

/** The group owns the size: every radio in one list reads the same mark. */
const RadioSizeContext = createContext<ControlSize>("md");

/** What a radio reads from its group: the selected value and the picker. */
type RadioGroupContextValue = {
  /** The value the group currently holds, or `undefined` before anything is picked. */
  value: string | undefined;
  /** Hands a radio's value to the group when the radio is tapped. */
  select: (value: string) => void;
  /** True when the group is disabled, which dims and locks every radio inside. */
  disabled: boolean;
  /** True when the group refuses a change without looking disabled. */
  readOnly: boolean;
};

/** What a radio outside any group reads: nothing selected, nothing to select into. */
const DEFAULT_GROUP: RadioGroupContextValue = { value: undefined, select: () => undefined, disabled: false, readOnly: false };

const RadioGroupContext = createContext<RadioGroupContextValue>(DEFAULT_GROUP);

/**
 * Props for {@link RadioGroup}; Base UI's `RadioGroup` members (`value`,
 * `defaultValue`, `onValueChange`, `disabled`, `name`) are spelled out here because
 * Lynx has no Base UI root to forward them to.
 */
export type RadioGroupProps = {
  /** Value the caller owns. Passing it makes the group controlled. */
  value?: string;
  /** Value selected at first render when the caller does not own it. */
  defaultValue?: string;
  /** Fires with the chosen value when the selection changes. */
  onValueChange?: (value: string) => void;
  /** Locks every radio in the group. @default false */
  disabled?: boolean;
  /** Keeps every radio focusable but refuses to change the selection. @default false */
  readOnly?: boolean;
  /** Marks the group as required by a form. Accepted for call-site parity; Lynx has no form submission. */
  required?: boolean;
  /** Form field name. Accepted for call-site parity; Lynx has no form submission. */
  name?: string;
  /** Element id of the group column. */
  id?: string;
  /**
   * Mark size for every `Radio` inside; a radio can still override it.
   * @default "md"
   */
  size?: RadioSize;
  /** Classes merged onto the group column, which stacks radios 12px apart; `"className"` is the React member, declared here instead of forwarded to a native element. */
  className?: string;
  /** The radios to group. */
  children?: ReactNode;
};

/**
 * {@link RadioGroupProps} plus the hyphenated accessible name a group needs. React took
 * `aria-label` from Base UI's root, which forwards every ARIA attribute; Lynx takes it as
 * one explicit prop, declared here so the exported prop type keeps exactly the members
 * React publishes.
 */
type RadioGroupRootProps = RadioGroupProps & {
  /** Accessible name of the group. */
  "aria-label"?: string;
};

/**
 * Groups {@link Radio} items so only one can be selected, and shares one mark size with all of
 * them. It renders a vertical flex column with a 12px gap and holds the selection itself in
 * uncontrolled mode, exactly as Base UI's radio group did.
 *
 * Lynx has no roving-focus keyboard model and no form element, so the group is a plain column that
 * announces its role and name: the selection travels through a context, which is what makes a tap
 * on one radio clear the previous one.
 *
 * @example
 * ```tsx
 * import { Radio, RadioGroup } from "@horon-ai/lynx";
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
export function RadioGroup({
  size = "md",
  className,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  readOnly = false,
  id,
  "aria-label": ariaLabel,
  children,
}: RadioGroupRootProps) {
  const [own, setOwn] = useState<string | undefined>(defaultValue);
  const selected = value === undefined ? own : value;

  // The context value is rebuilt only when the selection, a lock or the handler changes, so a
  // radio deep in a long list does not re-render on every keystroke elsewhere in the tree.
  const group = useMemo<RadioGroupContextValue>(() => {
    const select = (next: string) => {
      if (disabled || readOnly || next === selected) return;
      if (value === undefined) setOwn(next);
      onValueChange?.(next);
    };
    return { value: selected, select, disabled, readOnly };
  }, [disabled, readOnly, selected, value, onValueChange]);

  return (
    <RadioSizeContext.Provider value={size}>
      <RadioGroupContext.Provider value={group}>
        <view
          className={cn("flex flex-col gap-3", className)}
          accessibility-element
          accessibility-role-description="radiogroup"
          accessibility-label={ariaLabel}
          {...(id === undefined ? {} : { id })}
        >
          {children}
        </view>
      </RadioGroupContext.Provider>
    </RadioSizeContext.Provider>
  );
}

const labelClass: Record<RadioSize, string> = {
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
};

const textClass: Record<RadioSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
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

/** The Figma spring (`--ease-spring`), written out because an inline style cannot read a variable. */
const EASE_SPRING = "cubic-bezier(0.34, 1.3, 0.64, 1)";

/**
 * Props for {@link Radio}; Base UI's `Radio.Root` members (`value`, `disabled`,
 * `required`) are spelled out here because Lynx has no Base UI root to forward them to.
 */
export type RadioProps = {
  /**
   * The value this radio reports to its group when picked. Base UI kept it optional, so a radio
   * without one is still valid: it selects itself and reports nothing to the group.
   */
  value?: string;
  /** Text or node after the mark; tapping it picks the radio because both sit in one row. */
  label?: ReactNode;
  /** Locks this radio on its own, on top of the lock the group applies. @default false */
  disabled?: boolean;
  /** Marks the radio as required by a form. Accepted for call-site parity; Lynx has no form submission. */
  required?: boolean;
  /** Element id of the row. */
  id?: string;
  /** Overrides the enclosing `RadioGroup` size. */
  size?: RadioSize;
  /** Classes merged onto the row; `"className"` is the React member, declared here instead of forwarded to a native element. */
  className?: string;
};

/**
 * {@link RadioProps} plus the hyphenated accessible name a label-less radio needs. React took
 * `aria-label` from Base UI's root; Lynx takes it as one explicit prop, declared here so the
 * exported prop type keeps exactly the members React publishes.
 */
type RadioRootProps = RadioProps & {
  /** Accessible name when the row has no visible label. */
  "aria-label"?: string;
};

/**
 * Figma `Radio` (58:239): a 20px circle; checked fills with ink and an 8px dot.
 *
 * The mark and the label share one tappable row, so the label text is a target and the picked value
 * travels to {@link RadioGroup}, which is what clears the previous pick. The dot pops in on a spring
 * curve when the radio is picked. Outside a group the radio keeps its own flag, so a lone control
 * still shows its selection; only a group can move it to another radio.
 *
 * @example
 * ```tsx
 * import { Radio, RadioGroup } from "@horon-ai/lynx";
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
export function Radio({ value, label, disabled = false, id, size, className, "aria-label": ariaLabel }: RadioRootProps) {
  const groupSize = useContext(RadioSizeContext);
  const group = useContext(RadioGroupContext);
  const [own, setOwn] = useState(false);
  const resolvedSize = size ?? groupSize;
  const dimmed = disabled || group.disabled;
  const blocked = dimmed || group.readOnly;
  // A group value owns the pick; a lone radio falls back to its own flag so the control is still
  // usable outside a RadioGroup.
  const isSelected = group.value === undefined ? own : group.value === value;

  const pick = () => {
    if (blocked) return;
    setOwn(true);
    if (value !== undefined) group.select(value);
  };

  return (
    <view
      className={cn("inline-flex max-w-full min-w-0 flex-row items-center", labelClass[resolvedSize], dimmed && "opacity-40", className)}
      bindtap={pick}
      accessibility-element
      accessibility-traits={dimmed ? "disabled" : "button"}
      accessibility-role-description="radio"
      accessibility-label={ariaLabel}
      accessibility-value={isSelected ? "selected" : "unselected"}
      {...(id === undefined ? {} : { id })}
    >
      <view
        className={cn(
          "flex shrink-0 flex-row items-center justify-center rounded-full border-[1.5px] bg-bg-surface motion-colors",
          circleClass[resolvedSize],
          isSelected
            ? "border-interactive-primary bg-interactive-primary active:border-interactive-primary-hover active:bg-interactive-primary-hover"
            : "border-border-strong active:border-text-secondary",
        )}
      >
        {isSelected ? (
          <view
            className={cn("rounded-full bg-interactive-on-primary", dotClass[resolvedSize])}
            style={{ animationName: "pop-in", animationDuration: "220ms", animationTimingFunction: EASE_SPRING, animationFillMode: "both" }}
          />
        ) : null}
      </view>
      {typeof label === "string" || typeof label === "number" ? (
        <text className={cn("text-text-primary", textClass[resolvedSize])}>{label}</text>
      ) : (
        label
      )}
    </view>
  );
}
