import { useEffect, useRef, useState, type ReactNode } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types/background";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldTextClass, type InputSurface } from "./input";

/** Field rungs, shared with `ControlSize`: `sm` 88px, `md` 112px and `lg` 136px boxes. */
export type TextareaFieldSize = ControlSize;

/**
 * Props of {@link TextareaField}: the Lynx textarea attributes plus a label row, a description
 * or error footer, an optional counter and the surface.
 */
export type TextareaFieldProps = {
  /** Field label, one line at the rung's label size. */
  label: ReactNode;
  /** Right side of the label row, such as "Optional". */
  hint?: ReactNode;
  /** Help text in the footer; replaced by `error` when one is set. */
  description?: ReactNode;
  /** Error message; replaces the description and turns the border and footer red. */
  error?: ReactNode;
  /** Shows a "count / max" counter and caps the text at this length. */
  maxLength?: number;
  /** Box height, text and footer sizes: 88/112/136px. @default "md" */
  size?: TextareaFieldSize;
  /** Solid (default) or glass, as on `Input`. @default "solid" */
  surface?: InputSurface;
  /**
   * Extra classes on the field root, which is capped at 360px by default. The members react takes from
   * `ComponentProps` and the `"textarea"` element, `"className"` among them, are explicit props here.
   */
  className?: string;
  /** The text the caller owns; a change is written into the native editor with `setValue`. */
  value?: string;
  /** The text the field starts with when the caller does not own it. */
  defaultValue?: string;
  /** Placeholder text shown while the field is empty. */
  placeholder?: string;
  /** Caps the number of lines the editor grows to. */
  maxLines?: number;
  /** Blocks editing, dims the whole field to 60% and drops the counter updates. */
  disabled?: boolean;
  /** Keeps the text selectable and focusable but not editable. */
  readOnly?: boolean;
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Called with the new text after every edit; a disabled or read-only field never calls it. */
  onChange?: (value: string) => void;
};

const rootClass: Record<TextareaFieldSize, string> = {
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-2.5",
};

const labelClass: Record<TextareaFieldSize, string> = {
  sm: "text-label-sm",
  md: "text-label-md",
  lg: "text-label-lg",
};

const metaClass: Record<TextareaFieldSize, string> = {
  sm: "text-caption",
  md: "text-caption",
  lg: "text-body-sm",
};

/** The same box heights and padding as `Textarea` (88/112/136px, 12/14/20px), so one size reads the same in both. */
const boxClass: Record<TextareaFieldSize, string> = {
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
 * Figma `Textarea field` (60:466): label row, glass or solid box, footer with help text and counter.
 *
 * The label row sits above the box, `disabled` dims the whole field to 60%, and `error` marks the field
 * invalid, swaps the description for the error and paints the border and footer with the danger color. The
 * counter follows the live length, including a controlled `value` that changes without an input event.
 *
 * @example
 * ```tsx
 * import { TextareaField } from "@horon-ai/lynx";
 *
 * function PromptField() {
 *   return (
 *     <TextareaField
 *       label="Instructions"
 *       hint="Optional"
 *       description="Tell the bot how to answer."
 *       maxLength={280}
 *       size="md"
 *       placeholder="Be concise and cite sources."
 *     />
 *   );
 * }
 * ```
 */
export function TextareaField({
  label,
  hint,
  description,
  error,
  maxLength,
  size = "md",
  surface = "solid",
  className,
  value,
  defaultValue,
  placeholder,
  maxLines,
  disabled = false,
  readOnly = false,
  id,
  onChange,
}: TextareaFieldProps) {
  const [count, setCount] = useState(() => (value ?? defaultValue ?? "").length);
  const [focused, setFocused] = useState(false);
  const invalid = Boolean(error);
  const boxSurface =
    surface === "glass"
      ? cn(fieldBoxClass.glass, disabled && "opacity-60")
      : cn(fieldBoxClass[surface], disabled && "border-border-default bg-bg-subtle", invalid && "border-border-danger");
  const node = useRef<NodesRef | null>(null);
  // A controlled value can change without an input event (form reset, a parent rewriting it),
  // so the counter follows the value whenever the caller owns it.
  const length = value === undefined ? count : value.length;

  useEffect(() => {
    if (value === undefined) return;
    setCount(value.length);
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
    setCount(event.detail.value.length);
    onChange?.(event.detail.value);
  };

  return (
    <view
      className={cn(
        "flex w-full max-w-[360px] flex-col items-start",
        disabled && "opacity-60",
        rootClass[size],
        className,
      )}
    >
      <view className="flex w-full flex-row items-center">
        <text className={cn("min-w-0 flex-1 text-text-primary", labelClass[size])}>{label}</text>
        {hint ? <text className={cn("shrink-0 text-text-secondary", metaClass[size])}>{hint}</text> : null}
      </view>
      <view
        className={cn(
          "relative flex w-full overflow-hidden rounded-md border motion-colors",
          boxClass[size],
          boxSurface,
        )}
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
          )}
          default-value={defaultValue}
          placeholder={placeholder}
          maxlength={maxLength}
          maxlines={maxLines}
          disabled={disabled}
          readonly={readOnly}
          ref={node}
          bindinput={handleInput}
          bindfocus={() => setFocused(true)}
          bindblur={() => setFocused(false)}
        />
      </view>
      {description || error || maxLength !== undefined ? (
        <view
          className={cn(
            "flex w-full flex-row items-center gap-2 motion-colors",
          )}
        >
          <text
            className={cn(
              "min-w-0 flex-1",
              metaClass[size],
              invalid ? "text-text-danger" : "text-text-secondary",
            )}
          >
            {invalid ? error : description}
          </text>
          {maxLength === undefined ? null : (
            <text className={cn("shrink-0", metaClass[size], invalid ? "text-text-danger" : "text-text-secondary")}>
              {`${length} / ${maxLength}`}
            </text>
          )}
        </view>
      ) : null}
    </view>
  );
}
