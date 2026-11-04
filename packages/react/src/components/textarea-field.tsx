import { Field as BaseField } from "@base-ui/react/field";
import { useState, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldTextClass, type InputSurface } from "./input";

export type TextareaFieldSize = ControlSize;

export type TextareaFieldProps = Omit<ComponentProps<"textarea">, "className"> & {
  label: ReactNode;
  /** Right side of the label row, such as "Optional". */
  hint?: ReactNode;
  description?: ReactNode;
  /** Error message; replaces the description and turns the border and footer red. */
  error?: ReactNode;
  /** Shows a "count / max" counter when set. */
  maxLength?: number;
  size?: TextareaFieldSize;
  /** Solid (default) or glass, as on `Input`. */
  surface?: InputSurface;
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

const boxClass: Record<TextareaFieldSize, string> = {
  sm: "h-22 px-3 py-2",
  md: "h-30 px-3.5 py-3",
  lg: "h-34 px-4 py-3.5",
};

/** Figma `Textarea field` (60:466): label row, 88/120/136px glass or solid box, footer with help text and counter. */
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
  const invalid = !!error;
  return (
    <BaseField.Root
      disabled={disabled}
      invalid={invalid}
      className={cn("flex w-90 flex-col items-start data-disabled:opacity-60", rootClass[size], className)}
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
              {count} / {maxLength}
            </span>
          )}
        </div>
      )}
    </BaseField.Root>
  );
}
