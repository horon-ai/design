import { Field } from "@base-ui/react/field";
import type { ComponentProps } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldTextClass, type InputSurface } from "./input";

export type TextareaSize = ControlSize;

export type TextareaProps = Omit<ComponentProps<"textarea">, "className"> & {
  size?: TextareaSize;
  invalid?: boolean;
  /** Solid (default) or glass, as on `Input`. */
  surface?: InputSurface;
  className?: string;
  textareaClassName?: string;
};

const sizeClass: Record<TextareaSize, string> = {
  sm: "min-h-22 px-3 py-2",
  md: "min-h-28 px-3.5 py-3",
  lg: "min-h-34 px-5 py-3.5",
};

/** Figma `Textarea` (58:137): an 88/112/136px glass or solid box with 12/14/20px padding, the same field rungs as `Input`. */
export function Textarea({
  size = "md",
  invalid,
  surface = "solid",
  className,
  textareaClassName,
  rows = 3,
  ...props
}: TextareaProps) {
  return (
    <div
      className={cn(fieldBoxClass.base, "items-stretch", sizeClass[size], fieldBoxClass[surface], className)}
      data-invalid={invalid ? "" : undefined}
    >
      <Field.Control
        render={<textarea rows={rows} {...props} />}
        aria-invalid={invalid || undefined}
        className={cn("relative resize-none", fieldTextClass[size], fieldBoxClass.text, textareaClassName)}
      />
    </div>
  );
}
