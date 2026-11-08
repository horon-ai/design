import { useEffect, useRef, useState } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types/background";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldTextClass, type InputSurface } from "./input";

/** The rungs a Lynx textarea understands; it has no password mode. */
type LynxTextareaType = "text" | "number" | "digit" | "tel" | "email";

/** Textarea rungs, shared with `ControlSize`: `sm` 88px, `md` 112px and `lg` 136px heights. */
export type TextareaSize = ControlSize;

/** Props of {@link Textarea}: the Lynx textarea attributes plus the rung, invalid state and surface. */
export type TextareaProps = {
  /**
   * The text the caller owns. A change is written into the native editor with
   * `setValue`, because a Lynx `<textarea>` has no controlled `value` attribute.
   */
  value?: string;
  /** The text the field starts with when the caller does not own it. */
  defaultValue?: string;
  /** Placeholder text shown while the field is empty. */
  placeholder?: string;
  /** The kind of keyboard and text the field wants; a Lynx textarea has no password mode. @default text */
  type?: LynxTextareaType;
  /** Caps the text length. Lynx textareas default to 140 when this is omitted. */
  maxLength?: number;
  /** Caps the number of lines the editor grows to. */
  maxLines?: number;
  /** Blocks editing and dims the box. */
  disabled?: boolean;
  /** Keeps the text selectable and focusable but not editable. */
  readOnly?: boolean;
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Height, padding and text rung: 88/112/136px. @default "md" */
  size?: TextareaSize;
  /** Marks the box invalid, painting the danger border. */
  invalid?: boolean;
  /** Solid (default) or glass, as on `Input`. @default "solid" */
  surface?: InputSurface;
  /** Row count of the web textarea. Lynx heights come from the `size` rung, so the value is only kept for API parity. @default 3 */
  rows?: number;
  /**
   * Extra classes on the box that wraps the textarea. The members react takes from
   * `ComponentProps` (`"className"`) and from the `"textarea"` element are explicit props here.
   */
  className?: string;
  /** Classes for the native `<textarea>` itself, such as a fixed height or font. */
  textareaClassName?: string;
  /** Called with the new text after every edit; disabled and read-only fields never call it. */
  onChange?: (value: string) => void;
  /** Called when the field takes focus; the box draws its focus ring on this. */
  onFocus?: () => void;
  /** Called when the field loses focus. */
  onBlur?: () => void;
};

const sizeClass: Record<TextareaSize, string> = {
  sm: "h-[88px] px-3 py-2",
  md: "h-[112px] px-3.5 py-3",
  lg: "h-[136px] px-5 py-3.5",
};

/** The ring Lynx draws where react draws its 2px offset outline. */
const FOCUS_RING = { boxShadow: "0 0 0 2px var(--color-text-brand)" };

/**
 * Lynx's engine paints the placeholder from this variable; react's `placeholder:text-…` utility cannot run, so
 * the variable is set as a custom property through the class list, which Lynx inherits to the placeholder.
 */
const PLACEHOLDER_CLASS = "[--placeholder-color:var(--color-text-placeholder)]";

/** The only part of a Lynx textarea event a field reads. */
type LynxTextEvent = { detail: { value: string } };

/**
 * Figma `Textarea` (58:137): an 88/112/136px glass or solid box with 12/14/20px padding, the same field rungs as `Input`.
 *
 * A bare field box: no label or footer (use {@link TextareaField} for those). The box draws the focus ring and
 * the invalid border; the textarea itself fills it. Lynx's `<textarea>` carries its own text and emits
 * `bindinput`, so `onChange` receives the new string; a controlled `value` is written into the native editor
 * through `setValue`.
 *
 * @example
 * ```tsx
 * import { useState } from "@lynx-js/react";
 * import { Textarea } from "@horon-ai/lynx";
 *
 * function Notes() {
 *   const [notes, setNotes] = useState("");
 *   return (
 *     <Textarea
 *       size="md"
 *       surface="solid"
 *       placeholder="Add a note"
 *       value={notes}
 *       onChange={setNotes}
 *     />
 *   );
 * }
 * ```
 */
export function Textarea({
  value,
  defaultValue,
  placeholder,
  type = "text",
  maxLength,
  maxLines,
  disabled = false,
  readOnly = false,
  id,
  size = "md",
  invalid,
  surface = "solid",
  className,
  textareaClassName,
  onChange,
  onFocus,
  onBlur,
}: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const boxSurface =
    surface === "glass"
      ? cn(fieldBoxClass.glass, disabled && "opacity-60")
      : cn(fieldBoxClass[surface], disabled && "border-border-default bg-bg-subtle", invalid && "border-border-danger");
  const node = useRef<NodesRef | null>(null);

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
      className={cn(fieldBoxClass.base, "items-stretch", sizeClass[size], boxSurface, className)}
      style={focused ? FOCUS_RING : undefined}
    >
      <textarea
        id={id}
        className={cn(
          "relative h-full w-full",
          fieldTextClass[size],
          fieldBoxClass.text,
          PLACEHOLDER_CLASS,
          disabled && "text-text-disabled",
          textareaClassName,
        )}
        default-value={defaultValue}
        placeholder={placeholder}
        type={type}
        maxlength={maxLength}
        maxlines={maxLines}
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
      />
    </view>
  );
}
