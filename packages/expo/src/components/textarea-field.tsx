import { useState } from "react";
import { StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from "react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken, type TextStyleName } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { HoronText } from "../lib/text";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldTextClass, type InputSurface } from "./input";

/** Field rungs, shared with `ControlSize`: `sm` 88pt, `md` 112pt and `lg` 136pt boxes. */
export type TextareaFieldSize = ControlSize;

/**
 * Props of {@link TextareaField}: the text field's own members plus a label row, a description or
 * error footer, an optional counter and the surface.
 */
export type TextareaFieldProps = {
  /** Field label, one line at the rung's label size. */
  label: string;
  /** Right side of the label row, such as "Optional". */
  hint?: string;
  /** Help text in the footer; replaced by `error` when one is set. */
  description?: string;
  /** Error message; replaces the description and turns the border and footer red. */
  error?: string;
  /** Shows a "count / max" counter when set. */
  maxLength?: number;
  /**
   * Box height, text and footer sizes: 88/112/136pt.
   * @default "md"
   */
  size?: TextareaFieldSize;
  /**
   * Solid (default) or glass, as on `Input`.
   * @default "solid"
   */
  surface?: InputSurface;
  /** Blocks editing, dims the whole field and marks the field unavailable to assistive tech. */
  disabled?: boolean;
  /** The text the caller owns. Omit it (with `defaultValue`) to leave the text in the field. */
  value?: string;
  /** The text the field starts with when the caller does not own it. */
  defaultValue?: string;
  /** Text shown in the placeholder colour while the field is empty. */
  placeholder?: string;
  /** Keeps the text selectable and focusable but not editable. */
  readOnly?: boolean;
  /** Outer layout of the field, appended last; the field is capped at 360pt by default. */
  style?: StyleProp<ViewStyle>;
  /** Fires with the new text after every edit; a disabled or read-only field never fires it. */
  onChange?: (value: string) => void;
  /** Fires when the field takes focus; the box draws its ring on this. */
  onFocus?: () => void;
  /** Fires when the field loses focus. */
  onBlur?: () => void;
  /** Forwarded to the native input, for tests and automation. */
  testID?: string;
};

/** Gap between the label row, the box and the footer. */
const GAP: Record<TextareaFieldSize, number> = {
  sm: spacing["1.5"],
  md: spacing["2"],
  lg: spacing["2.5"],
};

const LABEL: Record<TextareaFieldSize, TextStyleName> = {
  sm: "label-sm",
  md: "label-md",
  lg: "label-lg",
};

const META: Record<TextareaFieldSize, TextStyleName> = {
  sm: "caption",
  md: "caption",
  lg: "body-sm",
};

/** The same box heights and padding as `Textarea` (88/112/136pt, 12/14/20pt), so one rung reads the same in both. */
const BOX: Record<TextareaFieldSize, ViewStyle> = {
  sm: { height: 88, paddingHorizontal: spacing["3"], paddingVertical: spacing["2"] },
  md: { height: 112, paddingHorizontal: spacing["3.5"], paddingVertical: spacing["3"] },
  lg: { height: 136, paddingHorizontal: spacing["5"], paddingVertical: spacing["3.5"] },
};

/**
 * Figma `Textarea field` (60:466): label row, glass or solid box, footer with help text and counter.
 *
 * The label sits above the box and `hint` at the right of the same row; `disabled` dims the whole
 * field to 40%, and `error` marks the field invalid, swaps the description for the error and paints
 * the border and footer with the danger colour. The box is fixed at its rung height, so the field
 * never grows under its footer. The counter follows the live length, including a controlled `value`
 * that changes without an input event.
 *
 * React forwarded a DOM change event from `onChange`; a React Native text field only emits its new
 * string, so `onChange` receives the text.
 *
 * @example
 * ```tsx
 * import { TextareaField } from "@horon-ai/expo";
 *
 * function PromptField() {
 *   return (
 *     <TextareaField
 *       label="Instructions"
 *       hint="Optional"
 *       description="Tell the bot how to answer."
 *       maxLength={280}
 *       size="md"
 *       placeholder="Be concise and cite sources."
 *     />
 *   );
 * }
 * ```
 */
export function TextareaField({
  label,
  hint,
  description,
  error,
  maxLength,
  size = "md",
  surface = "solid",
  disabled = false,
  value,
  defaultValue,
  placeholder,
  readOnly = false,
  style,
  onChange,
  onFocus,
  onBlur,
  testID,
}: TextareaFieldProps) {
  const theme = useHoronTheme();
  const [focused, setFocused] = useState(false);
  const [count, setCount] = useState(() => (value ?? defaultValue ?? "").length);
  // A controlled value can change without an input event (a form reset, a parent rewriting it), so
  // the counter follows the value whenever the caller owns it.
  const length = value === undefined ? count : value.length;
  const invalid = !!error;
  const glass = surface === "glass";
  const painted = glass ? null : fieldBoxClass[surface];
  const borderToken: ColorToken = invalid ? "border-danger" : disabled ? "border-default" : "border-default";

  return (
    <View style={[{ width: "100%", maxWidth: 360, gap: GAP[size] }, disabled && { opacity: 0.4 }, style]}>
      <View style={styles.labelRow}>
        <HoronText
          variant={LABEL[size]}
          tone={disabled ? "text-disabled" : "text-primary"}
          style={styles.label}
          accessibilityRole="text"
        >
          {label}
        </HoronText>
        {hint ? (
          <HoronText variant={META[size]} tone="text-secondary">
            {hint}
          </HoronText>
        ) : null}
      </View>
      <View
        style={[
          fieldBoxClass.base,
          styles.box,
          BOX[size],
          painted ? { backgroundColor: theme.color(disabled ? painted.disabledBackground : painted.background) } : null,
          { borderColor: theme.color(borderToken) },
          focused && {
            outlineWidth: 2,
            outlineOffset: 2,
            outlineStyle: "solid",
            outlineColor: theme.color("text-brand"),
          },
        ]}
        accessibilityState={{ disabled }}
      >
        {glass ? <GlassSurface material="veil" radius={radius.md} style={StyleSheet.absoluteFill} /> : null}
        <TextInput
          testID={testID}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          placeholderTextColor={theme.color(disabled ? "text-disabled" : "text-placeholder")}
          editable={!disabled && !readOnly}
          multiline
          maxLength={maxLength}
          textAlignVertical="top"
          accessibilityLabel={label}
          accessibilityHint={invalid ? error : description}
          accessibilityState={{ disabled }}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          onChangeText={(text) => {
            if (disabled || readOnly) return;
            setCount(text.length);
            onChange?.(text);
          }}
          style={[
            fieldBoxClass.text,
            theme.text(fieldTextClass[size]),
            { color: theme.color(disabled ? "text-disabled" : "text-primary") },
          ]}
        />
      </View>
      {description || error || maxLength !== undefined ? (
        <View style={styles.footer}>
          <HoronText
            variant={META[size]}
            tone={invalid ? "text-danger" : "text-secondary"}
            style={styles.label}
            numberOfLines={2}
          >
            {invalid ? error : description}
          </HoronText>
          {maxLength !== undefined ? (
            <HoronText variant={META[size]} tone={invalid ? "text-danger" : "text-secondary"}>
              {`${length} / ${maxLength}`}
            </HoronText>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: "row", alignItems: "center", gap: spacing["2"], width: "100%" },
  label: { flex: 1, minWidth: 0 },
  box: { alignItems: "stretch", width: "100%" },
  footer: { flexDirection: "row", alignItems: "center", gap: spacing["2"], width: "100%" },
});
