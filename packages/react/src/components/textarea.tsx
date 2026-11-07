import { Field } from "@base-ui/react/field";
import type { ComponentProps } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldTextClass, type InputSurface } from "./input";

/** Textarea rungs, shared with `ControlSize`: `sm` 88px, `md` 112px and `lg` 136px minimum heights. */
export type TextareaSize = ControlSize;

/** Props of {@link Textarea}: the native textarea attributes plus the rung, invalid state and surface. */
export type TextareaProps = Omit<ComponentProps<"textarea">, "className"> & {
  /** Minimum box height, padding and text rung: 88/112/136px. @default "md" */
  size?: TextareaSize;
  /** Marks the box invalid (`data-invalid`) and the textarea `aria-invalid`, painting the danger border. */
  invalid?: boolean;
  /** Solid (default) or glass, as on `Input`. @default "solid" */
  surface?: InputSurface;
  /** Extra classes on the box that wraps the textarea. */
  className?: string;
  /** Classes for the native `<textarea>` itself, such as a fixed height or font. */
  textareaClassName?: string;
};

const sizeClass: Record<TextareaSize, string> = {
  sm: "min-h-22 px-3 py-2",
  md: "min-h-28 px-3.5 py-3",
  lg: "min-h-34 px-5 py-3.5",
};

/**
 * Figma `Textarea` (58:137): an 88/112/136px glass or solid box with 12/14/20px padding, the same field rungs as `Input`.
 *
 * A bare field box: no label or footer (use {@link TextareaField} for those). The box draws the
 * `:focus-within` ring and the invalid border; the textarea itself fills it, starts at three rows
 * and is not user-resizable, so the rung keeps its height.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { Textarea } from "@horon-ai/react";
 *
 * function Notes() {
 *   const [notes, setNotes] = useState("");
 *   return (
 *     <Textarea
 *       aria-label="Notes"
 *       size="md"
 *       surface="solid"
 *       rows={4}
 *       placeholder="Add a note"
 *       value={notes}
 *       onChange={(event) => setNotes(event.target.value)}
 *     />
 *   );
 * }
 * ```
 */
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
