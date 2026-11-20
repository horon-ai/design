import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  type ReactElement,
  type ReactNode,
} from "react";
import { View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { spacing } from "@horon-ai/tokens";

import type { TextStyleName } from "../provider";
import { HoronText } from "../lib/text";
import type { ControlSize } from "../lib/size";

/** `md` outside a `Field`, so a part rendered on its own keeps the default rung rather than throwing. */
const FieldSizeContext = createContext<ControlSize>("md");

/** Whether the enclosing field marked its control invalid; `FieldError` reads it to decide whether to show. */
const FieldInvalidContext = createContext(false);

/** Whether the enclosing field disabled its control; the label dims with it. */
const FieldDisabledContext = createContext(false);

/** What the field hands to the control it wraps: the state and the label that names it. */
type FieldState = { invalid?: boolean; disabled?: boolean; accessibilityLabel?: string };

const GAP: Record<ControlSize, number> = {
  sm: spacing["1.5"],
  md: spacing["2"],
  lg: spacing["2.5"],
};

const LABEL: Record<ControlSize, TextStyleName> = {
  sm: "label-sm",
  md: "label-md",
  lg: "label-lg",
};

const META: Record<ControlSize, TextStyleName> = {
  sm: "caption",
  md: "caption",
  lg: "body-sm",
};

/** Props of {@link Field}: the control rung, the field state and the parts the field stacks. */
type FieldProps = {
  /**
   * Control rung shared by every part; sets the gap (6/8/10pt) and the label and meta type scales.
   * @default "md"
   */
  size?: ControlSize;
  /** Marks the control inside the field invalid, so its box paints the danger border. */
  invalid?: boolean;
  /** Disables the control inside the field and dims the label. */
  disabled?: boolean;
  /** Accessible name for the control, when the visible label is not a plain string. */
  accessibilityLabel?: string;
  /** Outer layout of the stack, appended last. */
  style?: StyleProp<ViewStyle>;
  /** The label, control and description or error the field stacks. */
  children?: ReactNode;
};

/**
 * Figma `Field examples` (58:163): label, control and help text, 6/8/10pt apart.
 *
 * A vertical stack whose gaps and text rungs follow `size` through context, so `FieldLabel`,
 * `FieldDescription` and `FieldError` match the control without repeating the size. Base UI's field
 * is a DOM form primitive and React Native has none, so the state reaches the control two ways: the
 * parts in this file read it from context, and the control placed directly inside the field receives
 * `invalid`, `disabled` and the label's text as `accessibilityLabel` — that is how an invalid `Field`
 * turns the `Input` inside it danger-red and how the label names the field for a screen reader.
 *
 * @example
 * ```tsx
 * import { Field, FieldDescription, FieldLabel, Input } from "@horon-ai/expo";
 *
 * function EmailField() {
 *   return (
 *     <Field size="md">
 *       <FieldLabel>Email</FieldLabel>
 *       <Input type="email" placeholder="you@example.com" />
 *       <FieldDescription>We only use it to sign you in.</FieldDescription>
 *     </Field>
 *   );
 * }
 * ```
 */
export function Field({
  size = "md",
  invalid = false,
  disabled = false,
  accessibilityLabel,
  style,
  children,
}: FieldProps) {
  const parts = Children.toArray(children);
  // The label names the control: React Native has no `<label for>` to point at the field, so a
  // plain-text label becomes the control's accessible name instead.
  const label = parts.find(
    (child): child is ReactElement<{ children?: ReactNode }> =>
      isValidElement(child) && child.type === FieldLabel,
  );
  const labelText = label?.props.children;
  const named =
    accessibilityLabel ??
    (typeof labelText === "string" || typeof labelText === "number" ? String(labelText) : undefined);

  return (
    <FieldSizeContext.Provider value={size}>
      <FieldInvalidContext.Provider value={invalid}>
        <FieldDisabledContext.Provider value={disabled}>
          <View style={[{ flexDirection: "column", alignItems: "flex-start", gap: GAP[size] }, style]}>
            {parts.map((child) => {
              if (!isValidElement<FieldState>(child) || child.type === FieldLabel) return child;
              if (child.type === FieldDescription || child.type === FieldError) return child;
              const state: FieldState = {};
              if (invalid) state.invalid = true;
              if (disabled) state.disabled = true;
              if (named && !child.props.accessibilityLabel) state.accessibilityLabel = named;
              if (Object.keys(state).length === 0) return child;
              return cloneElement(child, state);
            })}
          </View>
        </FieldDisabledContext.Provider>
      </FieldInvalidContext.Provider>
    </FieldSizeContext.Provider>
  );
}

/** Props of {@link FieldLabel}: the text that names the control the field wraps. */
type FieldLabelProps = {
  /**
   * Accepted for call-site parity with `@horon-ai/react`. React Native has no `<label for>`, so the
   * label names its control through the field: put the label and the control in one `Field`.
   */
  htmlFor?: string;
  /** Outer layout of the label, appended last. */
  style?: StyleProp<TextStyle>;
  /** The label text; a plain string also becomes the control's accessible name. */
  children?: ReactNode;
};

/**
 * Part of {@link Field}. The control's label: `label-sm`/`label-md`/`label-lg` from the field's size,
 * primary text, and the disabled colour when the field is disabled.
 */
export function FieldLabel({ htmlFor: _htmlFor, style, children }: FieldLabelProps) {
  const size = useContext(FieldSizeContext);
  const disabled = useContext(FieldDisabledContext);
  return (
    <HoronText variant={LABEL[size]} tone={disabled ? "text-disabled" : "text-primary"} style={style}>
      {children}
    </HoronText>
  );
}

/** Props of {@link FieldDescription}: the help line under the control. */
type FieldDescriptionProps = {
  /** Outer layout of the description, appended last. */
  style?: StyleProp<TextStyle>;
  /** The help text. */
  children?: ReactNode;
};

/**
 * Part of {@link Field}. The help line under the control in secondary text: `caption` at sm and md,
 * `body-sm` at lg. Always full width so the copy wraps inside the field.
 */
export function FieldDescription({ style, children }: FieldDescriptionProps) {
  const size = useContext(FieldSizeContext);
  return (
    <HoronText variant={META[size]} tone="text-secondary" style={[{ width: "100%" }, style]}>
      {children}
    </HoronText>
  );
}

/** Props of {@link FieldError}: the validation message and whether to show it. */
type FieldErrorProps = {
  /**
   * Show the message even when the enclosing field is not invalid, the same escape Base UI offers.
   * @default false
   */
  match?: boolean;
  /** Outer layout of the message, appended last. */
  style?: StyleProp<TextStyle>;
  /** The validation message. */
  children?: ReactNode;
};

/**
 * Part of {@link Field}. The validation message in `text-danger` at the field's meta rung. React
 * keeps the row mounted through its exit and collapses it as it fades, so the parts below glide up;
 * React Native lays the stack out without that transition, so the row is drawn only while it should
 * show, when the enclosing field is invalid or `match` is set, and the parts below move without a
 * jump because the row was never laid out.
 */
export function FieldError({ match = false, style, children }: FieldErrorProps) {
  const size = useContext(FieldSizeContext);
  const invalid = useContext(FieldInvalidContext);
  if (!match && !invalid) return null;
  return (
    <HoronText variant={META[size]} tone="text-danger" style={[{ width: "100%" }, style]}>
      {children}
    </HoronText>
  );
}
