import { Field as BaseField } from "@base-ui/react/field";
import { useState, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { fieldBoxClass } from "./input";
import { LiquidGlass } from "./liquid-glass";

export type TextareaFieldProps = Omit<ComponentProps<"textarea">, "className"> & {
  label: ReactNode;
  /** Right side of the label row, such as "Optional". */
  hint?: ReactNode;
  description?: ReactNode;
  /** Error message; replaces the description and turns the border and footer red. */
  error?: ReactNode;
  /** Shows a "count / max" counter when set. */
  maxLength?: number;
  className?: string;
};

/** Figma `Textarea field` (60:466): label row, 120px glass box, footer with help text and counter. */
export function TextareaField({
  label,
  hint,
  description,
  error,
  maxLength,
  disabled,
  className,
  defaultValue,
  value,
  onChange,
  ...props
}: TextareaFieldProps) {
  const [count, setCount] = useState(() => String(value ?? defaultValue ?? "").length);
  const invalid = !!error;
  return (
    <BaseField.Root
      disabled={disabled}
      invalid={invalid}
      className={cn("flex w-90 flex-col items-start gap-2 data-disabled:opacity-60", className)}
    >
      <div className="flex w-full items-center">
        <BaseField.Label className="min-w-0 flex-1 text-label-md text-text-primary">{label}</BaseField.Label>
        {hint && <span className="shrink-0 text-caption text-text-secondary">{hint}</span>}
      </div>
      <div
        className={cn(
          "relative flex h-30 w-full overflow-clip rounded-md border px-3.5 py-3 motion-colors",
          fieldBoxClass.glass,
          "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-text-brand",
        )}
      >
        <LiquidGlass tier="regular" />
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
          className={cn("relative h-full resize-none text-body-md", fieldBoxClass.text)}
        />
      </div>
      {(description || error || maxLength) && (
        <div
          className={cn(
            "motion-colors flex w-full items-center gap-2 text-caption",
            invalid ? "text-text-danger" : "text-text-secondary",
          )}
        >
          {invalid ? (
            <BaseField.Error
              match
              className="min-w-0 flex-1 animate-[tab-panel-in_160ms_var(--ease-out-quint)]"
            >
              {error}
            </BaseField.Error>
          ) : (
            <BaseField.Description className="min-w-0 flex-1">{description}</BaseField.Description>
          )}
          {maxLength !== undefined && (
            <span className="shrink-0 whitespace-nowrap">
              {count} / {maxLength}
            </span>
          )}
        </div>
      )}
    </BaseField.Root>
  );
}
