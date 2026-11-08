import { useState, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/** Box size of {@link Checkbox}; identical to {@link ControlSize}. */
export type CheckboxSize = ControlSize;

/**
 * Props of {@link Checkbox}. React took Base UI's checkbox root props; Lynx has
 * neither Base UI nor a hidden `<input>`, so the state props Base UI owned are
 * spelled out here with the same names and defaults, and the element's own
 * `"className"` is declared explicitly instead of forwarded.
 */
export type CheckboxProps = {
  /**
   * Ticked state the caller owns. Passing it makes the control controlled:
   * a tap reports the next state through `onCheckedChange` but does not move
   * the box by itself.
   */
  checked?: boolean;
  /** Ticked state at first render when the caller does not own it. @default false */
  defaultChecked?: boolean;
  /** Fires with the next state when a tap asks to tick or untick the box. */
  onCheckedChange?: (checked: boolean) => void;
  /** Blocks interaction and dims the whole row; the box keeps its state. @default false */
  disabled?: boolean;
  /** Keeps the box focusable but refuses to change it. @default false */
  readOnly?: boolean;
  /** Draws the mixed state: a filled box with a dash instead of a check. @default false */
  indeterminate?: boolean;
  /** Marks the control as required by a form. Accepted for call-site parity; Lynx has no form submission. */
  required?: boolean;
  /** Form field name. Accepted for call-site parity; Lynx has no form submission. */
  name?: string;
  /** Value the field would submit. Accepted for call-site parity; Lynx has no form submission. */
  value?: string;
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Label rendered after the box inside the same tappable row. */
  label?: ReactNode;
  /**
   * `md` is the 20px Figma Checkbox, `sm` the 18px box of the Data table (192:9046),
   * `lg` the 24px box.
   * @default "md"
   */
  size?: CheckboxSize;
  /** Extra classes merged onto the row; `"className"` is the one member the React root took from the native element and now receives as a plain prop */
  className?: string;
  /** Inline style, merged onto the row's own. */
  style?: CSSProperties;
};

/**
 * {@link CheckboxProps} plus the hyphenated accessible name a label-less box needs.
 * React took `aria-label` from Base UI's root, which forwards every ARIA attribute;
 * Lynx takes it as one explicit prop, declared here so the exported prop type keeps
 * exactly the members React publishes.
 */
type CheckboxRootProps = CheckboxProps & {
  /** Accessible name of the box when the row has no visible label. */
  "aria-label"?: string;
};

const labelClass: Record<CheckboxSize, string> = {
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
};

const textClass: Record<CheckboxSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
};

/** One 6px corner (`rounded-xs`, the Figma radius) at every size; only the box grows with the rung. */
const boxClass: Record<CheckboxSize, string> = {
  sm: "size-[18px] rounded-xs",
  md: "size-5 rounded-xs",
  lg: "size-6 rounded-xs",
};

/** The drawn check, 2px inside the box on every rung. */
const glyphSize: Record<CheckboxSize, number> = { sm: 12, md: 14, lg: 16 };

/** The Figma spring (`--ease-spring`), written out because an inline style cannot read a variable. */
const EASE_SPRING = "cubic-bezier(0.34, 1.3, 0.64, 1)";

/**
 * Figma `Checkbox` (58:217): a 20px box, 6px radius, with a 10px gap to its label.
 *
 * The box and its label share one tappable row, so the text is a target too. A
 * controlled `checked` keeps the caller in charge; otherwise the control holds
 * its own state seeded by `defaultChecked`. Checked and indeterminate boxes fill
 * with the brand color and show a check or a dash that pops in on the spring
 * curve; a disabled or read-only control dims and refuses the tap.
 *
 * Lynx has no hidden `<input>` and no `has-[[data-disabled]]` ancestor selector,
 * so the row carries the dim itself and the state is announced with
 * `accessibility-role-description` and `accessibility-value` instead of `aria-checked`.
 *
 * @example
 * ```tsx
 * import { Checkbox } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return <Checkbox label="Remember this chat" defaultChecked />;
 * }
 * ```
 */
export function Checkbox({
  label,
  size = "md",
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  readOnly = false,
  indeterminate = false,
  id,
  style,
  "aria-label": ariaLabel,
}: CheckboxRootProps) {
  const [own, setOwn] = useState(defaultChecked);
  const isChecked = checked ?? own;
  const blocked = disabled || readOnly;
  const filled = isChecked || indeterminate;

  const toggle = () => {
    if (blocked) return;
    const next = !isChecked;
    if (checked === undefined) setOwn(next);
    onCheckedChange?.(next);
  };

  return (
    <view
      className={cn("inline-flex max-w-full min-w-0 flex-row items-center", labelClass[size], disabled && "opacity-40", className)}
      bindtap={toggle}
      accessibility-element
      accessibility-traits={disabled ? "disabled" : "button"}
      accessibility-role-description="checkbox"
      accessibility-label={ariaLabel}
      accessibility-value={indeterminate ? "mixed" : isChecked ? "checked" : "unchecked"}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      <view
        className={cn(
          "flex shrink-0 flex-row items-center justify-center border-[1.5px] bg-bg-surface motion-colors",
          boxClass[size],
          filled
            ? "border-interactive-primary bg-interactive-primary active:border-interactive-primary-hover active:bg-interactive-primary-hover"
            : "border-border-strong active:border-text-secondary",
        )}
      >
        {filled ? (
          <view
            className="flex items-center justify-center"
            style={{ animationName: "pop-in", animationDuration: "220ms", animationTimingFunction: EASE_SPRING, animationFillMode: "both" }}
          >
            <Icon name={indeterminate ? "Minus" : "Check"} size={glyphSize[size]} color="interactive-on-primary" weight="bold" />
          </view>
        ) : null}
      </view>
      {typeof label === "string" || typeof label === "number" ? (
        <text className={cn("text-text-primary", textClass[size])}>{label}</text>
      ) : (
        label
      )}
    </view>
  );
}
