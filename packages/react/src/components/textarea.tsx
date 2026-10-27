import { Field } from "@base-ui/react/field";
import type { ComponentProps } from "react";

import { cn } from "../lib/cn";
import { fieldBoxClass } from "./input";
import { LiquidGlass } from "./liquid-glass";

export type TextareaProps = Omit<ComponentProps<"textarea">, "className"> & {
  invalid?: boolean;
  className?: string;
  textareaClassName?: string;
};

/** Figma `Textarea` (58:137): a 112px glass box with 14/12px padding. */
export function Textarea({ invalid, className, textareaClassName, rows = 3, ...props }: TextareaProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-28 overflow-clip rounded-md border px-3.5 py-3 motion-colors",
        fieldBoxClass.glass,
        "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-text-brand",
        className,
      )}
      data-invalid={invalid ? "" : undefined}
    >
      <LiquidGlass tier="regular" />
      <Field.Control
        render={<textarea rows={rows} {...props} />}
        aria-invalid={invalid || undefined}
        className={cn("relative resize-none text-body-md", fieldBoxClass.text, textareaClassName)}
      />
    </div>
  );
}
