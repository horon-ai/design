import { Field as BaseField } from "@base-ui/react/field";
import type { ComponentProps } from "react";

import { cn } from "../lib/cn";

type WithClass<T> = Omit<T, "className"> & { className?: string };

/** Figma `Field examples` (58:163): label, control and help text, 8px apart. */
export function Field({ className, ...props }: WithClass<ComponentProps<typeof BaseField.Root>>) {
  return <BaseField.Root className={cn("flex flex-col items-start gap-2", className)} {...props} />;
}

export function FieldLabel({ className, ...props }: WithClass<ComponentProps<typeof BaseField.Label>>) {
  return (
    <BaseField.Label
      className={cn("text-label-md text-text-primary data-disabled:text-text-disabled", className)}
      {...props}
    />
  );
}

export function FieldDescription({ className, ...props }: WithClass<ComponentProps<typeof BaseField.Description>>) {
  return <BaseField.Description className={cn("text-caption text-text-secondary", className)} {...props} />;
}

export function FieldError({ className, ...props }: WithClass<ComponentProps<typeof BaseField.Error>>) {
  return (
    <BaseField.Error
      className={cn("animate-[tab-panel-in_160ms_var(--ease-out-quint)] text-caption text-text-danger", className)}
      {...props}
    />
  );
}
