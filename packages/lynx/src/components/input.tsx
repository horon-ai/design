import { useEffect, useRef, useState, type ReactNode } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types/background";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/** Height rung shared with every sized control: `sm` 32px, `md` 40px, `lg` 48px. */
export type InputSize = ControlSize;

/**
 * Where the input sits:
 *
 * - `glass`: on imagery or a glass panel; uses the veil field (`.veil-field`) with no liquid layer inside.
 * - `solid`: on a raised surface (`bg-bg-surface`), the default.
 * - `solid-on-page`: directly on the page background (`bg-bg-default`), so the box reads against it.
 */
export type InputSurface = "glass" | "solid" | "solid-on-page";

/** The rungs Lynx's own `<input>` understands; a narrower set than the web's `type`. */
type InputType = "text" | "number" | "digit" | "password" | "tel" | "email";

/** The confirm key on the soft keyboard, Lynx's `confirm-type`. */
type InputConfirmType = "send" | "search" | "go" | "done" | "next";

/** Props of {@link Input}: the Lynx input attributes plus the box's size, surface and decorations. */
export type InputProps = {
  /**
   * The text the input shows when the caller owns it. A change to this value is
   * pushed into the native editor through `setValue`, because a Lynx `<input>`
   * has no controlled `value` attribute.
   */
  value?: string;
  /** The text the input starts with when the caller does not own it; the input then keeps its own state. */
  defaultValue?: string;
  /** Placeholder text shown while the input is empty. */
  placeholder?: string;
  /** The kind of keyboard and text the field wants. @default text */
  type?: InputType;
  /** Confirm key label on the soft keyboard. @default send */
  confirmType?: InputConfirmType;
  /** Caps the text length, the same role as the web `maxLength`. Lynx inputs default to 140 when this is omitted. */
  maxLength?: number;
  /** Blocks editing and dims the box. */
  disabled?: boolean;
  /** Keeps the text selectable and focusable but not editable. */
  readOnly?: boolean;
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Height and text rung: 32/40/48px with `body-sm/md/lg` text. @default "md" */
  size?: InputSize;
  /** `glass` over imagery and glass panels, `solid` on raised surfaces, `solid-on-page` directly on the page background. @default "solid" */
  surface?: InputSurface;
  /** Leading icon, 16px (sm, md) or 20px (lg), in the secondary text color. */
  icon?: ReactNode;
  /** Shows the error border. Inside a `Field`, an invalid field does the same. */
  invalid?: boolean;
  /**
   * Extra classes for the box that wraps the input. The members react takes from
   * the native element, `"className"` and `"size"`, are explicit props here.
   */
  className?: string;
  /** Classes for the native `<input>` itself. */
  inputClassName?: string;
  /** Called with the new text after every edit; disabled and read-only inputs never call it. */
  onChange?: (value: string) => void;
  /** Called when the input takes focus; the box draws its focus ring on this. */
  onFocus?: () => void;
  /** Called when the input loses focus. */
  onBlur?: () => void;
  /** Called with the text when the soft keyboard's confirm key is pressed. */
  onConfirm?: (value: string) => void;
};

/** Height, horizontal padding and icon size shared by every field-style control. */
export const fieldSizeClass: Record<ControlSize, string> = {
  sm: "h-8 gap-1.5 px-3",
  md: "h-10 gap-2 px-3.5",
  lg: "h-12 gap-2.5 px-5",
};

/** Body text size that matches each control rung. */
export const fieldTextClass: Record<ControlSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
};

/**
 * The class set a field-shaped control composes: the box (border, radius, focus ring), the surface fill and
 * the inner text/input. Shared by `Input` and `InputGroup` so every field-style control stays one material.
 *
 * Lynx has no `:focus-within`, `:has()` or `::placeholder`, so the state variants react expresses as
 * `has-[:disabled]:…` are computed in the component instead: the focus ring is a box-shadow drawn on the box
 * while the input holds focus, and the disabled and invalid fills are chosen with plain classes.
 */
export const fieldBoxClass = {
  /** The box is the focus target's container, so the ring is drawn around it, not around the inner input. */
  base: "motion-colors relative flex min-w-0 max-w-full items-center overflow-hidden rounded-md border",
  /** The veil field (globals.css `.veil-field`): no liquid layers, so hosts render no `LiquidGlass`. */
  glass: "veil-field",
  /** Raised surface fill with a default border; disabled and invalid states repaint both fill and border. */
  solid: "border-border-default bg-bg-surface",
  /** The solid fill on the page background instead of a raised surface. */
  "solid-on-page": "border-border-default bg-bg-default",
  /** The inner control: transparent, fills the remaining width, primary text and disabled colour. */
  text: "min-w-0 flex-1 bg-transparent text-text-primary",
} as const;

/** The ring Lynx draws where react draws its 2px offset outline. */
const FOCUS_RING = { boxShadow: "0 0 0 2px var(--color-text-brand)" };

/**
 * Lynx's engine paints the placeholder from this variable; react's `placeholder:text-…` utility cannot run, so
 * the variable is set as a custom property through the class list, which Lynx inherits to the placeholder.
 */
const PLACEHOLDER_CLASS = "[--placeholder-color:var(--color-text-placeholder)]";

/** The only part of a Lynx input event a field reads. */
type LynxTextEvent = { detail: { value: string } };

/**
 * Figma `Input` (58:126): SM, MD and LG, on Glass or Solid surface.
 *
 * A bordered box around Lynx's own `<input>`: render the box, then the optional leading icon, then the input,
 * which takes the remaining width. Focus is drawn on the box, so the ring never detaches from the field.
 * `invalid` paints the box border danger-red. Lynx's `<input>` carries its own text and emits `bindinput`
 * instead of DOM change events, so `onChange` receives the new string rather than an event; a controlled
 * `value` is mirrored into the native editor with the element's `setValue` method, since the element has no
 * `value` attribute.
 *
 * @example
 * ```tsx
 * import { Icon, Input } from "@horon-ai/lynx";
 *
 * function Search() {
 *   return (
 *     <Input
 *       type="text"
 *       size="md"
 *       icon={<Icon name="MagnifyingGlass" size={16} color="text-secondary" />}
 *       placeholder="Search agents"
 *     />
 *   );
 * }
 * ```
 */
export function Input({
  value,
  defaultValue,
  placeholder,
  type = "text",
  confirmType,
  maxLength,
  disabled = false,
  readOnly = false,
  id,
  size = "md",
  surface = "solid",
  icon,
  invalid = false,
  className,
  inputClassName,
  onChange,
  onFocus,
  onBlur,
  onConfirm,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const boxSurface =
    surface === "glass"
      ? cn(fieldBoxClass.glass, disabled && "opacity-60")
      : cn(fieldBoxClass[surface], disabled && "border-border-default bg-bg-subtle", invalid && "border-border-danger");
  const node = useRef<NodesRef | null>(null);

  // A controlled value can change without an input event (a form reset, a parent rewriting it). The element
  // keeps its own text, so the new value has to be written back through the native `setValue` method. The
  // effect only runs when the prop itself changes, so ordinary typing is never interrupted.
  useEffect(() => {
    if (value === undefined) return;
    const element = node.current;
    if (!element) return;
    try {
      element.invoke({ method: "setValue", params: { value } }).exec();
    } catch {
      // The render-test element API has no native methods; the emitted value is what the test asserts.
    }
  }, [value]);

  const handleInput = (event: LynxTextEvent) => {
    if (disabled || readOnly) return;
    onChange?.(event.detail.value);
  };

  return (
    <view
      className={cn(
        fieldBoxClass.base,
        boxSurface,
        fieldSizeClass[size],
        className,
      )}
      style={focused ? FOCUS_RING : undefined}
    >
      {icon && <view className="relative flex shrink-0 items-center">{icon}</view>}
      <input
        id={id}
        className={cn(
          "relative",
          fieldBoxClass.text,
          fieldTextClass[size],
          PLACEHOLDER_CLASS,
          disabled && "text-text-disabled",
          inputClassName,
        )}
        default-value={defaultValue}
        placeholder={placeholder}
        type={type}
        confirm-type={confirmType}
        maxlength={maxLength}
        disabled={disabled}
        readonly={readOnly}
        ref={node}
        bindinput={handleInput}
        bindfocus={() => {
          setFocused(true);
          onFocus?.();
        }}
        bindblur={() => {
          setFocused(false);
          onBlur?.();
        }}
        bindconfirm={(event: LynxTextEvent) => {
          if (disabled || readOnly) return;
          onConfirm?.(event.detail.value);
        }}
      />
    </view>
  );
}
