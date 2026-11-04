import { Input as BaseInput } from "@base-ui/react/input";
import { createContext, useContext, useMemo, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldTextClass, type InputSurface } from "./input";

export type InputGroupSize = ControlSize;

export type InputGroupProps = Omit<ComponentProps<typeof BaseInput>, "className" | "prefix" | "size"> & {
  /**
   * Segment before the input: `<Select variant="segment" />` or `<Combobox variant="segment" />`
   * for a choice such as a country code, or `<InputGroupSegment>` for fixed text.
   */
  prefix?: ReactNode;
  /** Segment after the input, such as a currency select. */
  suffix?: ReactNode;
  size?: InputGroupSize;
  invalid?: boolean;
  /** Solid (default) or glass, as on `Input`. */
  surface?: InputSurface;
  className?: string;
};

type InputGroupContextValue = { size: InputGroupSize; disabled: boolean; surface: InputSurface };

/** Lets a segment (select, combobox or fixed text) take the group's size, disabled state and surface. */
const InputGroupContext = createContext<InputGroupContextValue | null>(null);

/** The group a segment sits in, or null outside an `InputGroup`. */
export function useInputGroup() {
  return useContext(InputGroupContext);
}

const sizeClass: Record<InputGroupSize, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

/** The input's own padding, the same 12/14/20px as a standalone `Input`. */
const inputPaddingClass: Record<InputGroupSize, string> = {
  sm: "px-3",
  md: "px-3.5",
  lg: "px-5",
};

/** The tinted segment look, shared by `InputGroupSegment` and the `segment` variant of `Select` and `Combobox`. */
export const inputGroupSegmentClass: Record<InputGroupSize, string> = {
  sm: "relative flex h-full shrink-0 items-center gap-1 bg-overlay-ink-4 px-3 text-body-sm text-text-primary [&_svg]:size-4 [&_svg]:text-text-secondary",
  md: "relative flex h-full shrink-0 items-center gap-1 bg-overlay-ink-4 px-3 text-body-md text-text-primary [&_svg]:size-4 [&_svg]:text-text-secondary",
  lg: "relative flex h-full shrink-0 items-center gap-1.5 bg-overlay-ink-4 px-4 text-body-lg text-text-primary [&_svg]:size-5 [&_svg]:text-text-secondary",
};

const divider =
  "relative h-full w-px shrink-0 bg-border-default group-data-invalid:bg-border-danger group-data-disabled:bg-border-default/60";

/** Figma `Input group` (60:429): a glass or solid field split into a select segment and an input segment, in three sizes. */
export function InputGroup({
  prefix,
  suffix,
  size = "md",
  invalid,
  surface = "solid",
  className,
  disabled = false,
  ...props
}: InputGroupProps) {
  const context = useMemo(() => ({ size, disabled, surface }), [size, disabled, surface]);
  return (
    <InputGroupContext value={context}>
      <div
        className={cn(fieldBoxClass.base, "group", sizeClass[size], fieldBoxClass[surface], className)}
        data-invalid={invalid ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
      >
        {prefix && (
          <>
            {prefix}
            <span aria-hidden className={divider} />
          </>
        )}
        <div className={cn("relative flex h-full min-w-0 flex-1 items-center", inputPaddingClass[size])}>
          <BaseInput
            disabled={disabled}
            aria-invalid={invalid || undefined}
            className={cn(fieldBoxClass.text, fieldTextClass[size])}
            {...props}
          />
        </div>
        {suffix && (
          <>
            <span aria-hidden className={divider} />
            {suffix}
          </>
        )}
      </div>
    </InputGroupContext>
  );
}

/** A fixed-text segment, such as a unit or a `https://` prefix. Takes the group's size. */
export function InputGroupSegment({ className, children }: { className?: string; children: ReactNode }) {
  const group = useInputGroup();
  return (
    <div
      className={cn(inputGroupSegmentClass[group?.size ?? "md"], "group-data-disabled:text-text-disabled", className)}
    >
      {children}
    </div>
  );
}
