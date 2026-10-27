import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { fieldBoxClass } from "./input";
import { LiquidGlass } from "./liquid-glass";

export type InputGroupProps = Omit<ComponentProps<typeof BaseInput>, "className" | "prefix"> & {
  /** Segment before the input, such as a country code select. */
  prefix?: ReactNode;
  /** Segment after the input, such as a currency select. */
  suffix?: ReactNode;
  invalid?: boolean;
  className?: string;
};

const divider =
  "h-full w-px shrink-0 bg-border-default transition-colors duration-150 group-hover:bg-border-strong group-data-invalid:bg-border-danger";

/** Figma `Input group` (60:429): a glass field split into a select segment and an input segment. */
export function InputGroup({ prefix, suffix, invalid, className, disabled, ...props }: InputGroupProps) {
  return (
    <div
      className={cn(
        "group relative flex h-10 items-center overflow-clip rounded-md border motion-colors",
        fieldBoxClass.glass,
        "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-text-brand",
        className,
      )}
      data-invalid={invalid ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
    >
      <LiquidGlass tier="regular" />
      {prefix && (
        <>
          <InputGroupSegment>{prefix}</InputGroupSegment>
          <span aria-hidden className={cn("relative", divider)} />
        </>
      )}
      <div className="relative flex h-full min-w-0 flex-1 items-center px-3">
        <BaseInput
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={cn(fieldBoxClass.text, "text-body-md")}
          {...props}
        />
      </div>
      {suffix && (
        <>
          <span aria-hidden className={cn("relative", divider)} />
          <InputGroupSegment>{suffix}</InputGroupSegment>
        </>
      )}
    </div>
  );
}

/** The tinted `Select segment` of an input group: label-md text and a 14px icon. */
export function InputGroupSegment({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "relative flex h-full shrink-0 items-center gap-1 bg-overlay-ink-4 px-3 text-label-md text-text-primary group-data-disabled:text-text-disabled [&_svg]:size-3.5 [&_svg]:text-text-secondary",
        className,
      )}
    >
      {children}
    </div>
  );
}
