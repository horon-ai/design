import { Children, useState, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/** Height and label rung of {@link Chip}; identical to {@link ControlSize} (`sm` 28px, `md` 32px, `lg` 36px). */
export type ChipSize = ControlSize;

/**
 * The native surface React took from Base UI's toggle. Lynx has no toggle
 * element, so the state props Base UI owned are declared here and the component
 * keeps the same uncontrolled/controlled split: `pressed` makes it controlled,
 * otherwise it holds its own state and reports through `onPressedChange`.
 */
type PortedToggleAttributes = {
  /** Selected state the caller owns; a tap reports the next state but does not move the chip. */
  pressed?: boolean;
  /** Selected state at first render when the caller does not own it. @default false */
  defaultPressed?: boolean;
  /** Fires with the next selected state when the chip is tapped. */
  onPressedChange?: (pressed: boolean) => void;
  /** Blocks interaction and dims the chip to 40%. @default false */
  disabled?: boolean;
  /** Runs when the chip is tapped, after the state change. */
  onClick?: () => void;
  /** Kept for call-site parity. Lynx has no form submission, so it is inert. */
  type?: "button" | "submit" | "reset";
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the chip's own. */
  style?: CSSProperties;
};

/** Props of {@link Chip}. */
export type ChipProps = Omit<PortedToggleAttributes, "className"> & {
  /**
   * `md` is the 32px Figma Chip; `sm` is 28px and `lg` 36px.
   * @default "md"
   */
  size?: ChipSize;
  /** Extra classes merged onto the toggle. */
  className?: string;
  /** The label; a plain string or number is trimmed, any node is laid out in a row at the label gap. */
  children?: ReactNode;
};

const sizeClass: Record<ChipSize, string> = {
  sm: "h-7 px-2.5 text-label-sm",
  md: "h-8 px-3 text-label-md",
  lg: "h-9 px-3.5 text-label-lg",
};

/** The slot is 0px wide until pressed, then opens to icon + the label gap (6 / 8 / 10px). */
const checkSlotOpenClass: Record<ChipSize, string> = {
  sm: "w-[1.125rem]",
  md: "w-[1.375rem]",
  lg: "w-[1.625rem]",
};

/** Lynx sized the glyph through `size-3|3.5|4`; `<Icon>` takes the px number instead. */
const checkIconSize: Record<ChipSize, number> = { sm: 12, md: 14, lg: 16 };

/**
 * Figma `Chip` (61:302): a 32px solid toggle, no glass; selected shows a check, the brand border and brand text.
 *
 * Lynx has no toggle element and no `data-pressed` attribute selector in its
 * Tailwind preset, so the selected treatment is chosen in the class list from
 * the resolved `pressed` state instead of from a data attribute. The check sits
 * in a `0`-width slot that opens on press, so an unselected chip never reserves
 * the icon space; the slot only animates after the first toggle, so a chip that
 * mounts pressed does not flash it. An element child is laid out in a row at the
 * label gap.
 *
 * @example
 * ```tsx
 * import { Chip } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <view className="flex flex-row flex-wrap gap-2">
 *       <Chip defaultPressed>Documents</Chip>
 *       <Chip>Images</Chip>
 *     </view>
 *   );
 * }
 * ```
 */
export function Chip({
  size = "md",
  className,
  children,
  pressed,
  defaultPressed = false,
  onPressedChange,
  disabled = false,
  onClick,
  type: _type,
  id,
  style,
}: ChipProps) {
  // The exit animation only plays after the first toggle, so a chip that mounts unpressed never flashes the check.
  const [toggled, setToggled] = useState(false);
  const [own, setOwn] = useState(defaultPressed);
  const isPressed = pressed ?? own;

  // Lynx has no `svg` preflight, but an element child still needs its own row so
  // a glyph and a label sit on one line at the chip's own gap.
  const hasElementChild = Children.toArray(children).some(
    (child) => typeof child !== "string" && typeof child !== "number",
  );

  const toggle = () => {
    if (disabled) return;
    setToggled(true);
    const next = !isPressed;
    if (pressed === undefined) setOwn(next);
    onPressedChange?.(next);
    onClick?.();
  };

  return (
    <view
      className={cn(
        "motion-press relative flex shrink-0 flex-row items-center justify-center whitespace-nowrap rounded-full border",
        sizeClass[size],
        disabled ? "opacity-40" : "cursor-pointer",
        "border-border-default bg-bg-surface",
        isPressed ? "border-border-brand" : "",
        disabled ? "" : "active:bg-bg-subtle",
        className,
      )}
      style={style}
      bindtap={toggle}
      accessibility-element
      accessibility-traits={disabled ? "disabled" : isPressed ? "selected" : "button"}
      accessibility-role-description="checkbox"
      accessibility-value={isPressed ? "pressed" : "not pressed"}
      {...(id === undefined ? {} : { id })}
    >
      <view
        className={cn(
          "relative flex shrink-0 flex-row items-center overflow-hidden",
          isPressed ? checkSlotOpenClass[size] : "w-0",
          toggled ? "transition-[width] duration-150 ease-out" : "",
        )}
      >
        <view
          className={cn("flex flex-row items-center justify-center", isPressed ? "opacity-100" : "opacity-0")}
          style={
            toggled
              ? {
                  animationName: isPressed ? "pop-in" : "pop-out",
                  animationDuration: isPressed ? "220ms" : "130ms",
                  animationTimingFunction: isPressed ? "var(--ease-spring)" : "ease-in",
                  animationFillMode: "both",
                }
              : undefined
          }
        >
          <Icon
            name="Check"
            size={checkIconSize[size]}
            weight="bold"
            color={isPressed ? "text-brand" : "text-secondary"}
          />
        </view>
      </view>
      <view className={cn("relative flex flex-row items-center", hasElementChild && "gap-1.5")}>
        {typeof children === "string" || typeof children === "number" ? (
          <text className={cn("text-trim", isPressed ? "text-text-brand" : "text-text-primary")}>{children}</text>
        ) : (
          children
        )}
      </view>
    </view>
  );
}
