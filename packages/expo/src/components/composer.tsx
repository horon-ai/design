import { useState } from "react";
import { StyleSheet, TextInput, useWindowDimensions, View } from "react-native";
import { ArrowUp, Microphone, Plus } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { FIELD_MAX_FONT_SCALE, useFieldText } from "../lib/field-text";
import { GlassSurface } from "../lib/glass-surface";
import { controlHeight, type ControlSize } from "../lib/size";
import { IconButton } from "./icon-button";

/** Height and text rung of the composer: `sm` 32pt, `md` 40pt, `lg` 48pt, shared with the other controls. */
export type ComposerSize = ControlSize;
/** `solid` is the opaque bordered pill; `glass` is the veil field for imagery and glass panels. */
export type ComposerSurface = "solid" | "glass";

/** Props for {@link Composer}: the message value, the send callback and the two side actions. */
export type ComposerProps = {
  /** Rung of the field and its icon buttons. @default "md" */
  size?: ComposerSize;
  /** `solid` (default) on raised surfaces, `glass` over imagery and glass panels. @default "solid" */
  surface?: ComposerSurface;
  /** Field placeholder; it doubles as the accessible name because the field has no visible label. @default "Message" */
  placeholder?: string;
  /** Controlled text. Leave it out to let the composer own the value and still report changes. */
  value?: string;
  /** Starting text of the uncontrolled composer. @default "" */
  defaultValue?: string;
  /** Fires on every keystroke with the next full text, controlled or not. */
  onValueChange?: (value: string) => void;
  /** Fires with the full (untrimmed) text when the keyboard's send key or the send button submits; whitespace-only text blocks the submit and leaves the field alone. The field is cleared after. */
  onSubmit?: (value: string) => void;
  /** Fires when the plus button is pressed; the composer itself opens nothing. */
  onAttach?: () => void;
  /** Fires when the microphone button is pressed, i.e. while the field is empty. */
  onVoice?: () => void;
  /** Disables the field and both side buttons without changing the layout. */
  disabled?: boolean;

};

const PADDING = { sm: spacing["1.5"], md: spacing["2"], lg: spacing["2.5"] } as const;
const GAP = { sm: spacing["1.5"], md: spacing["2"], lg: spacing["2.5"] } as const;
const TEXT = { sm: "body-sm", md: "body-md", lg: "body-lg" } as const;

/**
 * Figma `Composer` (63:462): a regular-glass pill with an attach button, the
 * message field, and a voice button that turns into the ink send button once
 * there is text.
 *
 * The field is a multiline `TextInput`: it starts at the rung height and grows
 * up to four lines before it scrolls, and the keyboard's send key submits the
 * way Enter submits the react form. A value that is only whitespace blocks the
 * submit and leaves the typed text in place. The last slot holds both the voice
 * and the send button, and only the one that is showing stays mounted for
 * assistive technology and takes presses, so an empty field offers the voice
 * action and no send. `solid` is a bordered surface; `glass` is the veil field
 * from `@horon-ai/tokens`, which keeps the 2pt brand ring while focused.
 *
 * @example
 * ```tsx
 * <Composer
 *   placeholder="Ask anything"
 *   onAttach={() => openFilePicker()}
 *   onVoice={() => startDictation()}
 *   onSubmit={(text) => sendMessage(text)}
 * />
 * ```
 */
export function Composer({
  size = "md",
  surface = "solid",
  placeholder = "Message",
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  onAttach,
  onVoice,
  disabled,
}: ComposerProps) {
  const theme = useHoronTheme();
  const { fontScale } = useWindowDimensions();
  const [valueState, setValueState] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const value = valueProp ?? valueState;
  const fieldText = useFieldText(TEXT[size], { multiline: true, empty: value === "" });
  const setValue = (next: string) => {
    if (valueProp === undefined) setValueState(next);
    onValueChange?.(next);
  };
  const submit = () => {
    if (!value.trim()) return;
    onSubmit?.(value);
    setValue("");
  };
  const canSubmit = value.trim() !== "";
  const height = controlHeight[size];

  const content = (
    <>
      <IconButton
        size={size}
        icon={<Plus color={theme.color("text-secondary")} />}
        label="Attach"
        onPress={onAttach}
        disabled={disabled}
      />
      {/* The field box keeps the control height and centres the input, which grows line by line up
          to four lines; the input itself only spans its text, so one line sits in the middle. */}
      <View style={[styles.field, { minHeight: height }]}>
        <TextInput
          value={value}
          onChangeText={(next) => {
            if (disabled) return;
            setValue(next);
          }}
          placeholder={placeholder}
          placeholderTextColor={theme.color("text-placeholder")}
          accessibilityLabel={placeholder}
          editable={!disabled}
          multiline
          submitBehavior="submit"
          returnKeyType="send"
          onSubmitEditing={submit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxFontSizeMultiplier={FIELD_MAX_FONT_SCALE}
          style={[
            fieldText,
            {
              color: theme.color(disabled ? "text-disabled" : "text-primary"),
              maxHeight: theme.text(TEXT[size]).lineHeight * 4 * Math.min(fontScale, FIELD_MAX_FONT_SCALE),
            },
          ]}
        />
      </View>
      <View style={{ width: height, height }}>
        <View
          style={[StyleSheet.absoluteFill, { opacity: canSubmit ? 1 : 0 }]}
          pointerEvents={canSubmit ? "auto" : "none"}
          accessibilityElementsHidden={!canSubmit}
          importantForAccessibility={canSubmit ? "auto" : "no-hide-descendants"}
        >
          <IconButton
            size={size}
            variant="primary"
            icon={<ArrowUp />}
            label="Send"
            onPress={submit}
            disabled={disabled}
          />
        </View>
        <View
          style={[StyleSheet.absoluteFill, { opacity: canSubmit ? 0 : 1 }]}
          pointerEvents={canSubmit ? "none" : "auto"}
          accessibilityElementsHidden={canSubmit}
          importantForAccessibility={canSubmit ? "no-hide-descendants" : "auto"}
        >
          <IconButton
            size={size}
            icon={<Microphone color={theme.color("text-secondary")} />}
            label="Voice input"
            onPress={onVoice}
            disabled={disabled}
          />
        </View>
      </View>
    </>
  );

  const layout = [styles.pill, { gap: GAP[size], padding: PADDING[size] }];

  if (surface === "glass") {
    return (
      <View style={styles.host}>
        <GlassSurface material="veil" radius={radius.full} style={layout}>
          {content}
        </GlassSurface>
        {focused && (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.ring,
              { borderColor: theme.color("text-brand"), borderRadius: radius.full },
            ]}
          />
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        ...layout,
        styles.border,
        {
          borderColor: theme.color(focused ? "border-strong" : "border-default"),
          backgroundColor: theme.color("bg-surface"),
        },
      ]}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  host: { alignSelf: "stretch", borderCurve: "continuous" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
    minWidth: 0,
    borderRadius: radius.full,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  border: { borderWidth: 1 },
  ring: { borderWidth: 2, margin: -2 },
  field: { flex: 1, minWidth: 0, justifyContent: "center" },
});
