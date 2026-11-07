import { Field as BaseField } from "@base-ui/react/field";
import { useState, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldTextClass, type InputSurface } from "./input";

/** Field rungs, shared with `ControlSize`: `sm` 88px, `md` 112px and `lg` 136px boxes. */
export type TextareaFieldSize = ControlSize;

/**
 * Props of {@link TextareaField}: the native textarea attributes plus a label row, a description
 * or error footer, an optional counter and the surface.
 */
export type TextareaFieldProps = Omit<ComponentProps<"textarea">, "className"> & {
  /** Field label, one line at the rung's label size. */
  label: ReactNode;
  /** Right side of the label row, such as "Optional". */
  hint?: ReactNode;
  /** Help text in the footer; replaced by `error` when one is set. */
  description?: ReactNode;
  /** Error message; replaces the description and turns the border and footer red. */
  error?: ReactNode;
  /** Shows a "count / max" counter when set. */
  maxLength?: number;
  /** Box height, text and footer sizes: 88/112/136px. @default "md" */
  size?: TextareaFieldSize;
  /** Solid (default) or glass, as on `Input`. @default "solid" */
  surface?: InputSurface;
  /** Extra classes on the field root, which is capped at 360px by default. */
  className?: string;
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
  sm: "h-22 px-3 py-2",
  md: "h-28 px-3.5 py-3",
  lg: "h-34 px-5 py-3.5",
};

/**
 * Figma `Textarea field` (60:466): label row, glass or solid box, footer with help text and counter.
 *
 * Built on Base UI's field: the label is linked to the textarea, `disabled` dims the whole field
 * to 60%, and `error` marks the field invalid, swaps the description for the error and paints the
 * border and footer with the danger color. The counter follows the live length, including a
 * controlled `value` that changes without an input event.
 *
 * @example
 * ```tsx
 * import { TextareaField } from "@horon-ai/react";
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
  disabled,
  className,
  defaultValue,
  value,
  onChange,
  ...props
}: TextareaFieldProps) {
  const [count, setCount] = useState(() => String(value ?? defaultValue ?? "").length);
  // A controlled value can change without an input event (form reset, a parent rewriting it),
  // so the counter follows the value whenever the caller owns it.
  const length = value !== undefined ? String(value).length : count;
  const invalid = !!error;
  return (
    <BaseField.Root
      disabled={disabled}
      invalid={invalid}
      className={cn("flex w-full max-w-90 flex-col items-start data-disabled:opacity-60", rootClass[size], className)}
    >
      <div className="flex w-full items-center">
        <BaseField.Label className={cn("min-w-0 flex-1 text-text-primary", labelClass[size])}>{label}</BaseField.Label>
        {hint && <span className={cn("shrink-0 text-text-secondary", metaClass[size])}>{hint}</span>}
      </div>
      <div
        className={cn(
          "relative flex w-full overflow-clip rounded-md border motion-colors",
          boxClass[size],
          fieldBoxClass[surface],
        )}
      >
        <BaseField.Control
          render={
            <textarea
              defaultValue={defaultValue}
              value={value}
              onChange={(event) => {
                setCount(event.target.value.length);
                onChange?.(event);
              }}
              {...props}
            />
          }
          className={cn("relative h-full resize-none", fieldTextClass[size], fieldBoxClass.text)}
        />
      </div>
      {(description || error || maxLength) && (
        <div
          className={cn(
            "flex w-full items-center gap-2 motion-colors",
            metaClass[size],
            invalid ? "text-text-danger" : "text-text-secondary",
          )}
        >
          {invalid ? (
            <BaseField.Error match className="min-w-0 flex-1 animate-[tab-panel-in_160ms_var(--ease-out-quint)]">
              {error}
            </BaseField.Error>
          ) : (
            <BaseField.Description className="min-w-0 flex-1">{description}</BaseField.Description>
          )}
          {maxLength !== undefined && (
            <span className="shrink-0 whitespace-nowrap">
              {length} / {maxLength}
            </span>
          )}
        </div>
      )}
    </BaseField.Root>
  );
}
