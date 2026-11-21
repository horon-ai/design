import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type ReturnKeyTypeOptions,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { IconContext } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken, type TextStyleName } from "../provider";
import { FIELD_MAX_FONT_SCALE, useFieldText } from "../lib/field-text";
import { GlassSurface } from "../lib/glass-surface";
import { controlHeight, type ControlSize } from "../lib/size";
import { HoronText } from "../lib/text";
import { fieldBoxClass, fieldTextClass, type InputSurface } from "./input";

/** Height rung of the group and its segments: `sm` 32pt, `md` 40pt, `lg` 48pt. */
export type InputGroupSize = ControlSize;

/** The kinds of text the group's input asks for; React Native turns it into `keyboardType`. */
export type InputGroupType = "text" | "number" | "digit" | "password" | "tel" | "email";

/** The confirm key of the soft keyboard, React Native's `returnKeyType`. */
export type InputGroupConfirmType = "send" | "search" | "go" | "done" | "next";

/** Props of {@link InputGroup}: the input's own members plus the segments around it. */
export type InputGroupProps = {
  /**
   * Segment before the input: `<Select variant="segment" />` or `<Combobox variant="segment" />`
   * for a choice such as a country code, or `<InputGroupSegment>` for fixed text.
   */
  prefix?: ReactNode;
  /** Segment after the input, such as a currency select. */
  suffix?: ReactNode;
  /**
   * Height and text rung: 32/40/48pt, matching a standalone `Input`.
   * @default "md"
   */
  size?: InputGroupSize;
  /** Paints the danger border on the whole group and marks the input invalid. */
  invalid?: boolean;
  /**
   * Solid (default) or glass, as on `Input`.
   * @default "solid"
   */
  surface?: InputSurface;
  /** Outer layout of the box, appended last (width, margins). */
  style?: StyleProp<ViewStyle>;
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
  type?: InputGroupType;
  /** Caps the text length. */
  maxLength?: number;
  /** Confirm key label of the soft keyboard, reported through `onConfirm`. */
  confirmType?: InputGroupConfirmType;
  /** Blocks editing of the input and dims the segments. */
  disabled?: boolean;
  /** Keeps the text selectable and focusable but not editable. */
  readOnly?: boolean;
  /** Accessible name of the input; a `Field` label supplies it when the group sits inside one. */
  accessibilityLabel?: string;
  /** Fires with the new text after every edit; a disabled or read-only group never fires it. */
  onChange?: (value: string) => void;
  /** Fires with the new text after every edit, at the same moment as `onChange`. */
  onValueChange?: (value: string) => void;
  /** Fires when the input takes focus; the group draws its ring on this. */
  onFocus?: () => void;
  /** Fires when the input loses focus. */
  onBlur?: () => void;
  /** Fires with the text when the soft keyboard's confirm key is pressed. */
  onConfirm?: (value: string) => void;
  /** Forwarded to the native input, for tests and automation. */
  testID?: string;
};

/** What a segment reads from the group it sits in. */
type InputGroupContextValue = {
  /** Height rung the group was given. */
  size: InputGroupSize;
  /** Whether the group is disabled, so segments can dim and drop their own interactivity. */
  disabled: boolean;
  /** Surface the group uses, so a segment and the box stay the same material. */
  surface: InputSurface;
};

/** Lets a segment (select, combobox or fixed text) take the group's size, disabled state and surface. */
const InputGroupContext = createContext<InputGroupContextValue | null>(null);

/**
 * The group a segment sits in, or null outside an `InputGroup`. `Select` and `Combobox` call it in
 * their `segment` variant to pick the right height, padding and disabled look without a prop of
 * their own.
 *
 * @returns The `{ size, disabled, surface }` of the enclosing group, or `null` when there is none.
 */
export function useInputGroup() {
  return useContext(InputGroupContext);
}

/** Height, padding and text rung of the input's own slot per group size. */
const inputPadding: Record<InputGroupSize, ViewStyle> = {
  sm: { paddingHorizontal: spacing["3"] },
  md: { paddingHorizontal: spacing["3.5"] },
  lg: { paddingHorizontal: spacing["5"] },
};

/**
 * The tinted segment look, shared by {@link InputGroupSegment} and the `segment` variant of `Select`
 * and `Combobox`, the React Native form of react's `inputGroupSegmentClass`.
 *
 * React styled the segment through inherited classes; React Native has no text inheritance, so the
 * type rung is resolved with `useHoronTheme().text(...)` whenever a segment paints its own words.
 */
export const inputGroupSegmentClass: Record<InputGroupSize, { container: ViewStyle; text: TextStyleName }> = {
  sm: {
    container: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "stretch",
      flexShrink: 0,
      gap: spacing["1"],
      paddingHorizontal: spacing["3"],
    },
    text: "body-sm",
  },
  md: {
    container: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "stretch",
      flexShrink: 0,
      gap: spacing["1"],
      paddingHorizontal: spacing["3"],
    },
    text: "body-md",
  },
  lg: {
    container: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "stretch",
      flexShrink: 0,
      gap: spacing["1.5"],
      paddingHorizontal: spacing["4"],
    },
    text: "body-lg",
  },
};

/** The icon rung of each segment height, `[&_svg]:size-4` and `size-5` in react. */
const SEGMENT_ICON: Record<InputGroupSize, number> = { sm: 16, md: 16, lg: 20 };

/** React Native keyboard for each group type. */
const KEYBOARD: Record<InputGroupType, KeyboardTypeOptions> = {
  text: "default",
  number: "numeric",
  digit: "number-pad",
  password: "default",
  tel: "phone-pad",
  email: "email-address",
};

/** React Native return key for each confirm key. */
const RETURN_KEY: Record<InputGroupConfirmType, ReturnKeyTypeOptions> = {
  send: "send",
  search: "search",
  go: "go",
  done: "done",
  next: "next",
};

/**
 * Figma `Input group` (60:429): a glass or solid field split into a select segment and an input
 * segment, in three sizes.
 *
 * One box holds the optional `prefix`, the input and the optional `suffix`, with a hairline between
 * them; the hairlines turn danger red with `invalid` and dim with the group's `disabled`. The group
 * renders its own text field, so pass `placeholder`, `value` and `onChange` as props rather than
 * children. Size, disabled state and surface go to the segments through `useInputGroup()`, which is
 * why a `Select` or `Combobox` with `variant="segment"` matches without extra props.
 *
 * React reports a DOM change event from `onChange`; a React Native text field only emits its new
 * string, so `onChange` and `onValueChange` both receive the text.
 *
 * @example
 * ```tsx
 * import { InputGroup, InputGroupSegment } from "@horon-ai/expo";
 *
 * function Website() {
 *   return (
 *     <InputGroup
 *       prefix={<InputGroupSegment>https://</InputGroupSegment>}
 *       placeholder="horon.ai"
 *       size="md"
 *     />
 *   );
 * }
 * ```
 */
export function InputGroup({
  prefix,
  suffix,
  size = "md",
  invalid,
  surface = "solid",
  style,
  value,
  defaultValue,
  placeholder,
  type = "text",
  maxLength,
  confirmType,
  disabled = false,
  readOnly = false,
  accessibilityLabel,
  onChange,
  onValueChange,
  onFocus,
  onBlur,
  onConfirm,
  testID,
}: InputGroupProps) {
  const theme = useHoronTheme();
  const fieldText = useFieldText(fieldTextClass[size]);
  const [focused, setFocused] = useState(false);
  const context = useMemo(() => ({ size, disabled, surface }), [size, disabled, surface]);
  const glass = surface === "glass";
  const painted = glass ? null : fieldBoxClass[surface];
  const borderToken: ColorToken = invalid
    ? (painted?.invalidBorder ?? "border-danger")
    : disabled
      ? (painted?.disabledBorder ?? "border-default")
      : (painted?.border ?? "border-default");
  const dividerColor = theme.color(invalid ? "border-danger" : "border-default");

  return (
    <InputGroupContext.Provider value={context}>
      <View
        style={[
          fieldBoxClass.base,
          { height: controlHeight[size] },
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
        {prefix ? (
          <>
            {prefix}
            <View style={[styles.divider, { backgroundColor: dividerColor, opacity: disabled ? 0.6 : 1 }]} />
          </>
        ) : null}
        <View style={[styles.inputSlot, inputPadding[size]]}>
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
            style={[
              fieldBoxClass.text,
              fieldText,
              { color: theme.color(disabled ? "text-disabled" : "text-primary") },
            ]}
          />
        </View>
        {suffix ? (
          <>
            <View style={[styles.divider, { backgroundColor: dividerColor, opacity: disabled ? 0.6 : 1 }]} />
            {suffix}
          </>
        ) : null}
      </View>
    </InputGroupContext.Provider>
  );
}

/**
 * Part of {@link InputGroup}. A fixed-text segment, such as a unit or a `https://` prefix. Takes the
 * group's size (falling back to `md` outside a group), sits on the 4% ink tint, and dims its text
 * when the group is disabled.
 */
export function InputGroupSegment({ children }: {
  /** Segment content: short text, or text plus an icon sized by the segment's rung. */
  children: ReactNode;
}) {
  const theme = useHoronTheme();
  const group = useInputGroup();
  const rung = inputGroupSegmentClass[group?.size ?? "md"];
  return (
    <View
      style={[
        rung.container,
        {
          backgroundColor: theme.color("overlay-ink-4"),
          opacity: group?.disabled ? 0.6 : 1,
        },
      ]}
    >
      <SegmentContent size={group?.size ?? "md"} disabled={!!group?.disabled}>
        {children}
      </SegmentContent>
    </View>
  );
}

/**
 * A segment's content: plain words take the segment's type rung and colour, elements (an icon, a
 * nested select) are placed as they are, so a segment stays one row.
 */
function SegmentContent({
  size,
  disabled,
  children,
}: {
  size: InputGroupSize;
  disabled: boolean;
  children: ReactNode;
}) {
  const text = typeof children === "string" || typeof children === "number";
  const [iconContext] = useState(() => ({ size: SEGMENT_ICON[size], color: undefined }));
  return (
    <IconContext.Provider value={iconContext}>
      {text ? (
        <HoronText variant={inputGroupSegmentClass[size].text} tone={disabled ? "text-disabled" : "text-primary"}>
          {children}
        </HoronText>
      ) : (
        <View style={styles.segmentRow}>{children}</View>
      )}
    </IconContext.Provider>
  );
}

const styles = StyleSheet.create({
  inputSlot: { flexDirection: "row", alignItems: "center", alignSelf: "stretch", minWidth: 0, flex: 1 },
  segmentRow: { flexDirection: "row", alignItems: "center", gap: spacing["1"] },
  divider: { alignSelf: "stretch", width: 1, flexShrink: 0 },
});
