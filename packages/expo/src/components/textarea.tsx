import { useState } from "react";
import { StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from "react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldTextClass, type InputSurface } from "./input";

/** Textarea rungs, shared with `ControlSize`: `sm` 88pt, `md` 112pt and `lg` 136pt minimum heights. */
export type TextareaSize = ControlSize;

/** Props of {@link Textarea}: the text field's own members plus the rung, invalid state and surface. */
export type TextareaProps = {
  /** The text the caller owns. Omit it (with `defaultValue`) to leave the text in the field. */
  value?: string;
  /** The text the field starts with when the caller does not own it. */
  defaultValue?: string;
  /** Text shown in the placeholder colour while the field is empty. */
  placeholder?: string;
  /** Caps the text length. */
  maxLength?: number;
  /** Blocks editing, dims the box and marks the field unavailable to assistive tech. */
  disabled?: boolean;
  /** Keeps the text selectable and focusable but not editable. */
  readOnly?: boolean;
  /**
   * Minimum box height, padding and text rung: 88/112/136pt.
   * @default "md"
   */
  size?: TextareaSize;
  /** Marks the box invalid and paints the danger border. */
  invalid?: boolean;
  /**
   * Solid (default) or glass, as on `Input`.
   * @default "solid"
   */
  surface?: InputSurface;
  /** Outer layout of the box, appended last (height, margins). */
  style?: StyleProp<ViewStyle>;
  /**
   * Row count of the web textarea. A React Native box heights from the `size` rung, so the value is
   * kept for call-site parity only.
   * @default 3
   */
  rows?: number;
  /** Accessible name of the field; a `Field` label supplies it when the textarea sits inside one. */
  accessibilityLabel?: string;
  /** Fires with the new text after every edit; a disabled or read-only field never fires it. */
  onChange?: (value: string) => void;
  /** Fires when the field takes focus; the box draws its ring on this. */
  onFocus?: () => void;
  /** Fires when the field loses focus. */
  onBlur?: () => void;
  /** Forwarded to the native input, for tests and automation. */
  testID?: string;
};

/** Minimum box height and padding per rung, react's `min-h-22 px-3 py-2`, `min-h-28 px-3.5 py-3`, `min-h-34 px-5 py-3.5`. */
const sizeStyle: Record<TextareaSize, ViewStyle> = {
  sm: { minHeight: 88, paddingHorizontal: spacing["3"], paddingVertical: spacing["2"] },
  md: { minHeight: 112, paddingHorizontal: spacing["3.5"], paddingVertical: spacing["3"] },
  lg: { minHeight: 136, paddingHorizontal: spacing["5"], paddingVertical: spacing["3.5"] },
};

/**
 * Figma `Textarea` (58:137): an 88/112/136pt glass or solid box with 12/14/20pt padding, the same
 * field rungs as `Input`.
 *
 * A bare field box: no label or footer (use {@link TextareaField} for those). The box draws the
 * focus ring and the invalid border; the text field fills it, grows with its text and is not
 * user-resizable, so the rung sets the floor and the content sets the rest. `disabled` dims the box
 * and blocks editing; `readOnly` keeps the text selectable. The placeholder paints in
 * `text-placeholder`.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { Textarea } from "@horon-ai/expo";
 *
 * function Notes() {
 *   const [notes, setNotes] = useState("");
 *   return (
 *     <Textarea
 *       accessibilityLabel="Notes"
 *       size="md"
 *       surface="solid"
 *       placeholder="Add a note"
 *       value={notes}
 *       onChange={setNotes}
 *     />
 *   );
 * }
 * ```
 */
export function Textarea({
  value,
  defaultValue,
  placeholder,
  maxLength,
  disabled = false,
  readOnly = false,
  size = "md",
  invalid,
  surface = "solid",
  style,
  rows: _rows = 3,
  accessibilityLabel,
  onChange,
  onFocus,
  onBlur,
  testID,
}: TextareaProps) {
  const theme = useHoronTheme();
  const [focused, setFocused] = useState(false);
  const glass = surface === "glass";
  const painted = glass ? null : fieldBoxClass[surface];
  const borderToken: ColorToken = invalid
    ? (painted?.invalidBorder ?? "border-danger")
    : disabled
      ? (painted?.disabledBorder ?? "border-default")
      : (painted?.border ?? "border-default");

  return (
    <View
      style={[
        fieldBoxClass.base,
        styles.box,
        sizeStyle[size],
        painted ? { backgroundColor: theme.color(disabled ? painted.disabledBackground : painted.background) } : null,
        { borderColor: theme.color(borderToken) },
        glass && disabled && { opacity: 0.6 },
        focused && {
          outlineWidth: 2,
          outlineOffset: 2,
          outlineStyle: "solid",
          outlineColor: theme.color("text-brand"),
        },
        style,
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
        accessibilityLabel={accessibilityLabel}
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
          onChange?.(text);
        }}
        style={[
          fieldBoxClass.text,
          theme.text(fieldTextClass[size]),
          { color: theme.color(disabled ? "text-disabled" : "text-primary") },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: "stretch" },
});
