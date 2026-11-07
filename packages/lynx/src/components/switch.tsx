import { useState, type ReactNode } from "@lynx-js/react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/** Shared control rungs plus `compact`, the 40x24 Paper bot-memory switch that keeps its own rung. */
export type SwitchSize = ControlSize | "compact";

/**
 * Props of {@link Switch}: the state props Base UI's switch root owned (`checked`,
 * `defaultChecked`, `onCheckedChange`, `disabled`, `name`) plus the rung and the
 * optional inline label. Lynx has no hidden `<input>`, so the state is explicit.
 */
export type SwitchProps = {
  /** Active state the caller owns; a tap reports the next state but does not move the thumb. */
  checked?: boolean;
  /** Active state at first render when the caller does not own it. @default false */
  defaultChecked?: boolean;
  /** Fires with the next state when the switch is tapped. */
  onCheckedChange?: (checked: boolean) => void;
  /** Blocks interaction and dims the track. @default false */
  disabled?: boolean;
  /** Keeps the switch focusable but refuses to toggle it. @default false */
  readOnly?: boolean;
  /** Form field name. Accepted for call-site parity; Lynx has no form submission. */
  name?: string;
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Track and thumb rung: `sm` 32x20, `md` 44x26, `lg` 52x30, `compact` 40x24. @default "md" */
  size?: SwitchSize;
  /** When set, the switch sits at the end of a label row and the whole row toggles it. */
  label?: ReactNode;
  /** Extra classes, applied to the label row when `label` is set and to the switch itself otherwise; `"className"` is the React member, declared here instead of forwarded to a native element */
  className?: string;
};

/**
 * {@link SwitchProps} plus the hyphenated accessible name a label-less switch needs.
 * React took `aria-label` from Base UI's root, which forwards every ARIA attribute;
 * Lynx takes it as one explicit prop, declared here so the exported prop type keeps
 * exactly the members React publishes.
 */
type SwitchRootProps = SwitchProps & {
  /** Accessible name of the track when there is no visible label. */
  "aria-label"?: string;
};

const trackClass: Record<SwitchSize, string> = {
  sm: "h-5 w-8 p-0.5",
  md: "h-[26px] w-[44px] p-0.5",
  lg: "h-[30px] w-[52px] p-0.5",
  compact: "h-6 w-10 p-[3px]",
};

const thumbClass: Record<SwitchSize, string> = {
  sm: "size-4",
  md: "size-[22px]",
  lg: "size-[26px]",
  compact: "size-[18px]",
};

/** How far the thumb travels from its resting place, in CSS px: track width minus both paddings and the thumb. */
const travelClass: Record<SwitchSize, string> = {
  sm: "translate-x-[12px]",
  md: "translate-x-[18px]",
  lg: "translate-x-[22px]",
  compact: "translate-x-[16px]",
};

const labelClass: Record<SwitchSize, string> = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-4",
  compact: "gap-3",
};

const textClass: Record<SwitchSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
  compact: "text-body-sm",
};

const SPRING = "cubic-bezier(0.34, 1.3, 0.64, 1)";

/**
 * Switch: MD 44x26 and SM 32x20 tracks with a white thumb 2px in; LG is 52x30; COMPACT 40x24 with an
 * 18px thumb 3px in (Paper bot memory). The thumb stays white on the grey track in both themes and
 * takes the inverse of the ink fill when checked, so the checked state reads the same in dark.
 *
 * A controlled `checked` keeps the caller in charge; otherwise the switch holds its own state. The
 * thumb springs across in 220ms on the `--ease-spring` curve, which is written out inline because a
 * Lynx style object cannot read a CSS variable, and the track repaints on checked and disabled.
 * With `label` the control becomes a row whose text toggles it, so the switch needs no separate
 * accessible name.
 *
 * Lynx has no `hover` and no hidden `<input>`: the pressed feedback is `active:`, and the state is
 * announced with `accessibility-role-description="switch"` plus `accessibility-value`.
 *
 * @example
 * ```tsx
 * import { useState } from "@lynx-js/react";
 * import { Switch } from "@horon-ai/lynx";
 *
 * function MemoryToggle() {
 *   const [remember, setRemember] = useState(true);
 *   return (
 *     <Switch
 *       label="Remember this bot's memory"
 *       size="compact"
 *       checked={remember}
 *       onCheckedChange={setRemember}
 *     />
 *   );
 * }
 * ```
 */
export function Switch({
  size = "md",
  label,
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  readOnly = false,
  id,
  "aria-label": ariaLabel,
}: SwitchRootProps) {
  const [own, setOwn] = useState(defaultChecked);
  const isChecked = checked ?? own;
  const blocked = disabled || readOnly;

  const toggle = () => {
    if (blocked) return;
    const next = !isChecked;
    if (checked === undefined) setOwn(next);
    onCheckedChange?.(next);
  };

  const thumb = (
    <view
      className={cn(
        // The thumb is a flex child of a fixed-width track whose content box can be
        // narrower than the thumb plus its travel; `shrink-0` holds it at its own
        // size so the track never reads as a bare bar.
        "shrink-0 rounded-full bg-text-on-ink",
        isChecked && "bg-interactive-on-primary",
        thumbClass[size],
        isChecked ? travelClass[size] : "translate-x-0",
      )}
      style={{ transitionProperty: "transform, background-color", transitionDuration: "220ms", transitionTimingFunction: SPRING }}
    />
  );

  const trackClassList = cn(
    "relative inline-flex shrink-0 flex-row items-center rounded-full bg-border-strong motion-colors",
    isChecked ? "bg-interactive-primary active:bg-interactive-primary-hover" : "active:bg-interactive-secondary-hover",
    trackClass[size],
  );

  // Without a label the switch is the whole control; with one, the row takes the tap and
  // carries the dim and the accessibility state so the text is a target too.
  if (!label) {
    return (
      <view
        className={cn(trackClassList, disabled && "opacity-40", className)}
        bindtap={toggle}
        accessibility-element
        accessibility-traits={disabled ? "disabled" : "button"}
        accessibility-role-description="switch"
        accessibility-label={ariaLabel}
        accessibility-value={isChecked ? "checked" : "unchecked"}
        {...(id === undefined ? {} : { id })}
      >
        {thumb}
      </view>
    );
  }

  return (
    <view
      className={cn("inline-flex max-w-full min-w-0 flex-row items-center", labelClass[size], disabled && "opacity-40", className)}
      bindtap={toggle}
      accessibility-element
      accessibility-traits={disabled ? "disabled" : "button"}
      accessibility-role-description="switch"
      accessibility-label={ariaLabel}
      accessibility-value={isChecked ? "checked" : "unchecked"}
      {...(id === undefined ? {} : { id })}
    >
      {typeof label === "string" || typeof label === "number" ? (
        <text className={cn("min-w-0 flex-1 text-text-primary", textClass[size])}>{label}</text>
      ) : (
        label
      )}
      <view className={trackClassList}>{thumb}</view>
    </view>
  );
}
