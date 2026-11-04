import { Field as BaseField } from "@base-ui/react/field";
import { createContext, useContext, type ComponentProps } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

type WithClass<T> = Omit<T, "className"> & { className?: string };

const FieldSizeContext = createContext<ControlSize>("md");

const gapClass: Record<ControlSize, string> = {
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-2.5",
};

const labelClass: Record<ControlSize, string> = {
  sm: "text-label-sm",
  md: "text-label-md",
  lg: "text-label-lg",
};

const metaClass: Record<ControlSize, string> = {
  sm: "text-caption",
  md: "text-caption",
  lg: "text-body-sm",
};

/** Figma `Field examples` (58:163): label, control and help text, 6/8/10px apart. */
export function Field({
  size = "md",
  className,
  ...props
}: WithClass<Omit<ComponentProps<typeof BaseField.Root>, "size">> & { size?: ControlSize }) {
  return (
    <FieldSizeContext.Provider value={size}>
      <BaseField.Root className={cn("flex flex-col items-start", gapClass[size], className)} {...props} />
    </FieldSizeContext.Provider>
  );
}

export function FieldLabel({ className, ...props }: WithClass<ComponentProps<typeof BaseField.Label>>) {
  const size = useContext(FieldSizeContext);
  return (
    <BaseField.Label
      className={cn(labelClass[size], "text-text-primary data-disabled:text-text-disabled", className)}
      {...props}
    />
  );
}

export function FieldDescription({ className, ...props }: WithClass<ComponentProps<typeof BaseField.Description>>) {
  const size = useContext(FieldSizeContext);
  return <BaseField.Description className={cn(metaClass[size], "w-full text-text-secondary", className)} {...props} />;
}

export function FieldError({ className, children, ...props }: WithClass<ComponentProps<typeof BaseField.Error>>) {
  const size = useContext(FieldSizeContext);
  // Base UI keeps the message mounted through its exit (`data-ending-style`), so the row can close
  // as it fades: the fields below move with it instead of jumping when the text appears.
  return (
    <BaseField.Error
      className={cn(
        "motion-reveal data-ending-style:grid-rows-[0fr] data-starting-style:grid-rows-[0fr]",
        "data-ending-style:opacity-0 data-starting-style:opacity-0",
        metaClass[size],
        "text-text-danger",
        className,
      )}
      {...props}
    >
      <span className="block">{children}</span>
    </BaseField.Error>
  );
}
