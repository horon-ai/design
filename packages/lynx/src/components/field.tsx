import { cloneElement, createContext, isValidElement, useContext, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/** `md` outside a `Field`, so a part rendered on its own keeps the default rung rather than throwing. */
const FieldSizeContext = createContext<ControlSize>("md");

/** Whether the enclosing field marked its control invalid; `FieldError` reads it to decide whether to show. */
const FieldInvalidContext = createContext(false);

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

/** Props of {@link Field}: the control rung, the field state and the children the field stacks. */
type FieldProps = {
  /** Control rung shared by every part; sets the gap (6/8/10px) and the label and meta type scales. @default "md" */
  size?: ControlSize;
  /** Marks the control inside the field invalid, so its box paints the danger border. @default false */
  invalid?: boolean;
  /** Disables the control inside the field. @default false */
  disabled?: boolean;
  /** Extra classes appended after the stack's own classes. */
  className?: string;
  /** Inline style, merged onto the stack's own. */
  style?: CSSProperties;
  /** The label, control and description or error the field stacks. */
  children?: ReactNode;
};

/**
 * Figma `Field examples` (58:163): label, control and help text, 6/8/10px apart.
 *
 * A vertical stack (`max-w-full`, left aligned) whose gaps and text rungs follow `size` through context, so
 * `FieldLabel`, `FieldDescription` and `FieldError` match the control without repeating the size. Base UI's
 * field is a DOM form primitive and Lynx has none, so the field state is passed down in two ways: the parts in
 * this file read it from context, and the control placed directly inside the field receives `invalid` and
 * `disabled` as props — that is how an invalid `Field` turns the `Input` inside it danger-red, exactly as Base
 * UI's field does on the web.
 *
 * @example
 * ```tsx
 * import { Field, FieldDescription, FieldError, FieldLabel, Input } from "@horon-ai/lynx";
 *
 * function EmailField() {
 *   return (
 *     <Field size="md">
 *       <FieldLabel htmlFor="email">Email</FieldLabel>
 *       <Input id="email" type="email" placeholder="you@example.com" />
 *       <FieldDescription>We only use it to sign you in.</FieldDescription>
 *     </Field>
 *   );
 * }
 * ```
 */
export function Field({ size = "md", invalid = false, disabled = false, className, style, children }: FieldProps) {
  /**
   * Hands the field state to the control: the parts of this field keep their own props, everything else placed
   * directly inside the field is a control and gets `invalid`/`disabled` so it can paint the right border.
   */
  const withFieldState = (child: ReactNode): ReactNode => {
    if (!isValidElement(child)) return child;
    const type = child.type;
    if (type === FieldLabel || type === FieldDescription || type === FieldError) return child;
    const state: { invalid?: boolean; disabled?: boolean } = {};
    if (invalid) state.invalid = true;
    if (disabled) state.disabled = true;
    if (Object.keys(state).length === 0) return child;
    return cloneElement(child, state);
  };

  return (
    <FieldSizeContext.Provider value={size}>
      <FieldInvalidContext.Provider value={invalid}>
        <view className={cn("flex min-w-0 max-w-full flex-col items-start", gapClass[size], className)} style={style}>
          {Array.isArray(children) ? children.map((child) => withFieldState(child)) : withFieldState(children)}
        </view>
      </FieldInvalidContext.Provider>
    </FieldSizeContext.Provider>
  );
}

/** Props of {@link FieldLabel}: the text and the id of the control it labels. */
type FieldLabelProps = {
  /** Id of the control; tapping the label focuses that node through Lynx's selector query. */
  htmlFor?: string;
  /** Extra classes appended after the label's own classes. */
  className?: string;
  /** Inline style, merged onto the label's own. */
  style?: CSSProperties;
  /** The label text. */
  children?: ReactNode;
};

/**
 * Part of {@link Field}. The control's label (`Field.Label`): `label-sm/md/lg` from the field's size and
 * primary text. Lynx has no `<label>`, so tapping the text focuses the control itself: give it `htmlFor`
 * matching the control's `id` and the field wires the two together, which is what makes clicking the text
 * focus the input on the web.
 */
export function FieldLabel({ htmlFor, className, style, children }: FieldLabelProps) {
  const size = useContext(FieldSizeContext);
  return (
    <text
      className={cn(labelClass[size], "text-text-primary", className)}
      style={style}
      bindtap={() => {
        if (!htmlFor || typeof lynx === "undefined") return;
        try {
          lynx.createSelectorQuery().select(`#${htmlFor}`).invoke({ method: "focus" }).exec();
        } catch {
          // The render-test element API has no native methods; focus is a device-level detail.
        }
      }}
    >
      {children}
    </text>
  );
}

/** Props of {@link FieldDescription}: the help line under the control. */
type FieldDescriptionProps = {
  /** Extra classes appended after the description's own classes. */
  className?: string;
  /** Inline style, merged onto the description's own. */
  style?: CSSProperties;
  /** The help text. */
  children?: ReactNode;
};

/**
 * Part of {@link Field}. The help line under the control (`Field.Description`) in secondary text: `caption` at
 * sm and md, `body-sm` at lg. Always full width so the copy wraps inside the field.
 */
export function FieldDescription({ className, style, children }: FieldDescriptionProps) {
  const size = useContext(FieldSizeContext);
  return (
    <text className={cn(metaClass[size], "w-full text-text-secondary", className)} style={style}>
      {children}
    </text>
  );
}

/** Props of {@link FieldError}: the validation message and whether to show it. */
type FieldErrorProps = {
  /** Show the message even when the enclosing field is not invalid, the same escape Base UI offers. @default false */
  match?: boolean;
  /** Extra classes appended after the message's own classes. */
  className?: string;
  /** Inline style, merged onto the message row's own. */
  style?: CSSProperties;
  /** The validation message. */
  children?: ReactNode;
};

/**
 * Part of {@link Field}. The validation message in `text-text-danger` at the field's meta rung. Lynx has no
 * mount/unmount transition and no `grid-rows-[0fr]` collapse, so the row is drawn only while it should show:
 * when the enclosing field is invalid or `match` is set. The parts below then move up with the field instead
 * of a jump, because the row was never laid out.
 */
export function FieldError({ match = false, className, style, children }: FieldErrorProps) {
  const size = useContext(FieldSizeContext);
  const invalid = useContext(FieldInvalidContext);
  if (!match && !invalid) return null;
  return (
    <view className={cn("flex w-full items-start", className)} style={style}>
      <text className={cn(metaClass[size], "text-text-danger")}>{children}</text>
    </view>
  );
}
