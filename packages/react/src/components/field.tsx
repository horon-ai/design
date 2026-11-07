import { Field as BaseField } from "@base-ui/react/field";
import { createContext, useContext, type ComponentProps } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

type WithClass<T> = Omit<T, "className"> & {
  /** Extra classes appended after the part's own classes. */
  className?: string;
};

/** `md` outside a `Field`, so a part rendered on its own keeps the default rung rather than throwing. */
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

/**
 * Figma `Field examples` (58:163): label, control and help text, 6/8/10px apart.
 *
 * Wraps Base UI's `Field.Root`, a vertical stack (`max-w-full`, left aligned) whose gaps and text
 * rungs follow `size` through context, so `FieldLabel`, `FieldDescription` and `FieldError` match the
 * control without repeating the size. `invalid` (or Base UI's own validation) marks the control inside
 * the field invalid, and the control's box paints its danger border from that.
 *
 * @example
 * ```tsx
 * import { Field, FieldDescription, FieldError, FieldLabel, Input } from "@horon-ai/react";
 *
 * function EmailField() {
 *   return (
 *     <Field size="md">
 *       <FieldLabel htmlFor="email">Email</FieldLabel>
 *       <Input id="email" type="email" placeholder="you@example.com" />
 *       <FieldDescription>We only use it to sign you in.</FieldDescription>
 *       <FieldError>Enter a valid address.</FieldError>
 *     </Field>
 *   );
 * }
 * ```
 */
export function Field({
  size = "md",
  className,
  ...props
}: WithClass<Omit<ComponentProps<typeof BaseField.Root>, "size">> & {
  /** Control rung shared by every part; sets the gap (6/8/10px) and the label and meta type scales. @default "md" */
  size?: ControlSize;
}) {
  return (
    <FieldSizeContext.Provider value={size}>
      <BaseField.Root
        className={cn("flex max-w-full min-w-0 flex-col items-start", gapClass[size], className)}
        {...props}
      />
    </FieldSizeContext.Provider>
  );
}

/**
 * Part of {@link Field}. The control's label (`Field.Label`): `label-sm/md/lg` from the field's size,
 * primary text, and the disabled colour when its control is disabled. Give it `htmlFor` matching the
 * control's `id`, which is also what makes clicking the text focus the control.
 */
export function FieldLabel({ className, ...props }: WithClass<ComponentProps<typeof BaseField.Label>>) {
  const size = useContext(FieldSizeContext);
  return (
    <BaseField.Label
      className={cn(labelClass[size], "text-text-primary data-disabled:text-text-disabled", className)}
      {...props}
    />
  );
}

/**
 * Part of {@link Field}. The help line under the control (`Field.Description`) in secondary text:
 * `caption` at sm and md, `body-sm` at lg. Always full width so the copy wraps inside the field, and
 * Base UI wires it to the control as the description for assistive tech.
 */
export function FieldDescription({ className, ...props }: WithClass<ComponentProps<typeof BaseField.Description>>) {
  const size = useContext(FieldSizeContext);
  return <BaseField.Description className={cn(metaClass[size], "w-full text-text-secondary", className)} {...props} />;
}

/**
 * Part of {@link Field}. The validation message (`Field.Error`) in `text-text-danger` at the field's
 * meta rung. It stays mounted only while it should show: Base UI renders it when the enclosing field is
 * invalid, or when `match` is set, and keeps it mounted through its exit — the row collapses from `1fr`
 * to `0fr` as it fades, so the parts below glide up instead of jumping.
 */
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
