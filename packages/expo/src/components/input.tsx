import { useState, type ReactNode } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type ReturnKeyTypeOptions,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { IconContext } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken, type TextStyleName } from "../provider";
import { FIELD_MAX_FONT_SCALE, useFieldText } from "../lib/field-text";
import { GlassSurface } from "../lib/glass-surface";
import { useIconContext } from "../lib/icon";
import { controlHeight, type ControlSize } from "../lib/size";

/** Height rung shared with every sized control: `sm` 32pt, `md` 40pt, `lg` 48pt. */
export type InputSize = ControlSize;

/**
 * Where the input sits:
 *
 * - `glass`: on imagery or a glass panel; the veil material, drawn by a `GlassSurface`, with a
 *   transparent ring instead of a painted fill.
 * - `solid`: on a raised surface (`bg-surface`), the default.
 * - `solid-on-page`: directly on the page background (`bg-default`), so the box reads against it.
 */
export type InputSurface = "glass" | "solid" | "solid-on-page";

/** The kinds of text a field asks for; React Native turns it into `keyboardType` and secure entry. */
export type InputType = "text" | "number" | "digit" | "password" | "tel" | "email";

/** The confirm key of the soft keyboard, React Native's `returnKeyType`. */
export type InputConfirmType = "send" | "search" | "go" | "done" | "next";

/** Props of {@link Input}: the text field's own members plus the box's size, surface and decorations. */
export type InputProps = {
  /** The text the caller owns. Omit it (with `defaultValue`) to leave the text in the field. */
  value?: string;
  /** The text the field starts with when the caller does not own it. */
  defaultValue?: string;
  /** Text shown in the placeholder colour while the field is empty. */
  placeholder?: string;
  /**
   * The kind of keyboard and text the field wants; `password` also hides the text.
   * @default "text"
   */
  type?: InputType;
  /** Confirm key label of the soft keyboard, reported through `onConfirm`. */
  confirmType?: InputConfirmType;
  /** Caps the text length. */
  maxLength?: number;
  /** Blocks editing, paints the box 40% and marks the field unavailable to assistive tech. */
  disabled?: boolean;
  /** Keeps the text selectable and focusable but not editable. */
  readOnly?: boolean;
  /**
   * Height and text rung: 32/40/48pt with `body-sm`, `body-md` and `body-lg`.
   * @default "md"
   */
  size?: InputSize;
  /**
   * `glass` over imagery and glass panels, `solid` on raised surfaces, `solid-on-page` directly on
   * the page background.
   * @default "solid"
   */
  surface?: InputSurface;
  /** Leading icon, 16pt (sm, md) or 20pt (lg), in the secondary text colour. */
  icon?: ReactNode;
  /** Shows the danger border. Inside a `Field`, an invalid field does the same. */
  invalid?: boolean;
  /** Outer layout of the box, appended last (width, margins). */
  style?: StyleProp<ViewStyle>;
  /** Accessible name of the field; a `Field` label supplies it when the input sits inside one. */
  accessibilityLabel?: string;
  /** Fires with the new text after every edit; a disabled or read-only field never fires it. */
  onChange?: (value: string) => void;
  /** Fires with the new text after every edit, at the same moment as `onChange`. */
  onValueChange?: (value: string) => void;
  /** Fires when the field takes focus; the box draws its ring on this. */
  onFocus?: () => void;
  /** Fires when the field loses focus. */
  onBlur?: () => void;
  /** Fires with the text when the soft keyboard's confirm key is pressed. */
  onConfirm?: (value: string) => void;
  /** Forwarded to the native input, for tests and automation. */
  testID?: string;
};

/**
 * Height, padding, gap and icon rung per size, the React Native form of react's
 * `fieldSizeClass`.
 *
 * React grows `sm` and `md` to 44px on a coarse pointer. A phone is always a coarse pointer, but a
 * text field is not a press target, so the painted rung keeps the Figma 32/40/48pt height and a
 * wrapped press target grows with `hitSlop` instead.
 */
export const fieldSizeClass: Record<ControlSize, ViewStyle> = {
  sm: { minHeight: controlHeight.sm, gap: spacing["1.5"], paddingHorizontal: spacing["3"] },
  md: { minHeight: controlHeight.md, gap: spacing["2"], paddingHorizontal: spacing["3.5"] },
  lg: { minHeight: controlHeight.lg, gap: spacing["2.5"], paddingHorizontal: spacing["5"] },
};

/**
 * Body text rung that matches each control rung, the React Native form of react's
 * `fieldTextClass`: resolve it with `useHoronTheme().text(...)`, or hand it to `HoronText`.
 */
export const fieldTextClass: Record<ControlSize, TextStyleName> = {
  sm: "body-sm",
  md: "body-md",
  lg: "body-lg",
};

/**
 * The paint a field-shaped control composes, shared by every field-style control so they stay one
 * material.
 *
 * React shipped this as Tailwind class strings; React Native has no class names, so each member is
 * the data the box reads, resolved through `useHoronTheme()` at render time:
 *
 * - `base` is the box geometry: the hairline border, `md` radius, row layout and clipped corners.
 * - `glass` is a marker: the surface is the veil, drawn by a `GlassSurface` behind the content.
 * - `solid` and `solid-on-page` name the fill and border tokens, plus the disabled and invalid
 *   repaints react expresses as `has-[:disabled]` and `data-invalid` variants.
 * - `text` is the inner control's own text style: transparent, full width, the rung's line height.
 */
export const fieldBoxClass = {
  base: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
    maxWidth: "100%",
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: radius.md,
    borderCurve: "continuous",
  } as ViewStyle,
  glass: { material: "veil" } as const,
  solid: {
    background: "bg-surface",
    border: "border-default",
    disabledBackground: "bg-subtle",
    disabledBorder: "border-default",
    invalidBorder: "border-danger",
  } as const,
  "solid-on-page": {
    background: "bg-default",
    border: "border-default",
    disabledBackground: "bg-subtle",
    disabledBorder: "border-default",
    invalidBorder: "border-danger",
  } as const,
  text: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    backgroundColor: "transparent",
  } as TextStyle,
} as const;

/** The icon rung of each field height, `[&_svg]:size-4` and `size-5` in react. */
const ICON: Record<ControlSize, number> = { sm: 16, md: 16, lg: 20 };

/** React Native keyboard for each field type. */
const KEYBOARD: Record<InputType, KeyboardTypeOptions> = {
  text: "default",
  number: "numeric",
  digit: "number-pad",
  password: "default",
  tel: "phone-pad",
  email: "email-address",
};

/** React Native return key for each confirm key. */
const RETURN_KEY: Record<InputConfirmType, ReturnKeyTypeOptions> = {
  send: "send",
  search: "search",
  go: "go",
  done: "done",
  next: "next",
};

/**
 * Figma `Input` (58:126): SM, MD and LG, on Glass or Solid surface.
 *
 * A bordered box around React Native's `TextInput`: the box, then the optional leading icon, then
 * the input, which takes the remaining width. Focus is drawn on the box (`outline`), so the ring
 * never detaches from the field. `invalid` paints the box border danger red; `disabled` dims the
 * box and blocks editing through `editable={false}`; `readOnly` blocks editing but keeps the text
 * selectable. The placeholder paints in `text-placeholder`.
 *
 * React reports a DOM change event from `onChange`; a React Native text field only emits its new
 * string, so `onChange` and `onValueChange` both receive the text.
 *
 * @example
 * ```tsx
 * import { MagnifyingGlass } from "phosphor-react-native";
 * import { Input } from "@horon-ai/expo";
 *
 * function Search() {
 *   return (
 *     <Input
 *       size="md"
 *       icon={<MagnifyingGlass />}
 *       placeholder="Search agents"
 *       accessibilityLabel="Search agents"
 *     />
 *   );
 * }
 * ```
 */
export function Input({
  value,
  defaultValue,
  placeholder,
  type = "text",
  confirmType,
  maxLength,
  disabled = false,
  readOnly = false,
  size = "md",
  surface = "solid",
  icon,
  invalid,
  style,
  accessibilityLabel,
  onChange,
  onValueChange,
  onFocus,
  onBlur,
  onConfirm,
  testID,
}: InputProps) {
  const theme = useHoronTheme();
  const fieldText = useFieldText(fieldTextClass[size]);
  const [focused, setFocused] = useState(false);
  const glass = surface === "glass";
  const iconColour = theme.color("text-secondary");
  const iconContext = useIconContext({ size: ICON[size], color: iconColour });
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
        fieldSizeClass[size],
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
      {icon ? (
        <IconContext.Provider value={iconContext}>
          <View style={styles.icon}>{icon}</View>
        </IconContext.Provider>
      ) : null}
      <TextInput
        testID={testID}
        maxFontSizeMultiplier={FIELD_MAX_FONT_SCALE}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        placeholderTextColor={theme.color(disabled ? "text-disabled" : "text-placeholder")}
        editable={!disabled && !readOnly}
        maxLength={maxLength}
        keyboardType={KEYBOARD[type]}
        secureTextEntry={type === "password"}
        returnKeyType={confirmType ? RETURN_KEY[confirmType] : undefined}
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
          onValueChange?.(text);
        }}
        onSubmitEditing={(event) => {
          if (disabled || readOnly) return;
          onConfirm?.(event.nativeEvent.text);
        }}
        style={[fieldBoxClass.text, fieldText, { color: theme.color(disabled ? "text-disabled" : "text-primary") }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: { flexShrink: 0, alignItems: "center", justifyContent: "center" },
});
