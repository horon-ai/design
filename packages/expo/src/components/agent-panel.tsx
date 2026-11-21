import { useMemo, useState, type ReactNode } from "react";
import { StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from "react-native";
import { CaretDown, IconContext } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { fillFromClass } from "../lib/class-color";
import { FIELD_MAX_FONT_SCALE, useFieldText } from "../lib/field-text";
import { HoronPressable } from "../lib/press";
import { useDevice } from "../hooks/use-device";
import { DISABLED_OPACITY, TOUCH_TARGET } from "../lib/size";
import { HoronText } from "../lib/text";
import { Kbd } from "./kbd";

/** Props of {@link AgentPanel}: the filter slot under its top and the panel body. */
export type AgentPanelProps = {
  /** Filter slot under the panel top, such as a `FilterBar`. */
  filter?: ReactNode;
  /** The panel body. */
  children?: ReactNode;
  /** Layout of the panel, for margins or a width override. */
  style?: StyleProp<ViewStyle>;
};

/**
 * The solid panel that hosts the Figma Agents blocks (Agent tasks 112:797): surface fill, 24px radius, 16px padding.
 *
 * @example
 * ```tsx
 * <AgentPanel filter={<FilterBar items={[{ value: "all", label: "All" }]} />}>
 *   <TaskComposer onStart={start} pickers={<ComposerChip leading="R">Researcher</ComposerChip>} />
 * </AgentPanel>
 * ```
 */
export function AgentPanel({ filter, children, style }: AgentPanelProps) {
  const theme = useHoronTheme();
  return (
    <View
      style={[
        styles.panel,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
        style,
      ]}
    >
      {filter ? <View style={styles.filter}>{filter}</View> : null}
      {children}
    </View>
  );
}

/** Props for {@link ComposerChip}: a leading tile letter or icon, its fill, and the usual button props. */
export type ComposerChipProps = {
  /** 16px tile initial (bots) or a 14px icon (projects). */
  leading?: ReactNode;
  /** Tile fill as the react background class, such as `bg-sky-500`, resolved against the token palette. */
  tileClassName?: string;
  /** The chip label. */
  children?: ReactNode;
  /** Runs when the chip is tapped. */
  onPress?: () => void;
  /** Blocks the chip and dims it to 40%. */
  disabled?: boolean;
  /** Accessible name when the visible label is not the whole name. */
  accessibilityLabel?: string;
  /** Layout of the chip, for alignment. */
  style?: StyleProp<ViewStyle>;
};

/**
 * A 30px 5% ink picker chip with a 12px caret, used for the bot and project in the task composer.
 * Part of {@link TaskComposer}; the chip is a plain button, so it needs its own `onPress` or menu wiring.
 *
 * @example
 * ```tsx
 * <ComposerChip leading="R" onPress={pickBot}>Researcher</ComposerChip>
 * ```
 */
export function ComposerChip({
  leading,
  tileClassName,
  children,
  onPress,
  disabled,
  accessibilityLabel,
  style,
}: ComposerChipProps) {
  const theme = useHoronTheme();
  const iconDefaults = useMemo(() => ({ color: theme.color("text-secondary"), size: 14 }), [theme]);
  return (
    <HoronPressable
      role="button"
      pressScale
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: theme.color(pressed ? "overlay-ink-8" : "overlay-ink-5"),
          minHeight: theme.touch ? TOUCH_TARGET : 30,
        },
        disabled && { opacity: DISABLED_OPACITY },
        style,
      ]}
    >
      {typeof leading === "string" ? (
        <View
          style={[styles.chipTile, { backgroundColor: fillFromClass(theme, tileClassName, "interactive-primary") }]}
        >
          <HoronText variant="label-sm" tone="text-inverse">
            {leading}
          </HoronText>
        </View>
      ) : leading ? (
        <IconContext.Provider value={iconDefaults}>
          <View style={styles.chipIcon}>{leading}</View>
        </IconContext.Provider>
      ) : null}
      {typeof children === "string" || typeof children === "number" ? (
        <HoronText variant="label-sm">{children}</HoronText>
      ) : (
        children
      )}
      <CaretDown size={12} color={theme.color("text-secondary")} />
    </HoronPressable>
  );
}

/** Props for {@link TaskComposer}: the draft text, picker chips, the start handler and the labels. */
export type TaskComposerProps = {
  /** Placeholder of the textarea; also its accessible name. @default "Describe a task for a bot" */
  placeholder?: string;
  /** Controlled draft text; leave undefined and pass `onValueChange` to lift the text, or omit both for a free draft. */
  value?: string;
  /** Fires on every keystroke with the next text, so the caller can hold the draft. */
  onValueChange?: (value: string) => void;
  /** Picker chips, usually two `ComposerChip`s. */
  pickers?: ReactNode;
  /** Fires on the Start button, the keyboard's submit key having no modifier on a phone. */
  onStart?: () => void;
  /** Label of the start button. @default "Start" */
  startLabel?: string;
  /** Layout of the box, for margins or width overrides. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Figma task `Composer` (Agent tasks 112:797): a 4% ink box, 20px radius, with pickers, a key hint and Start.
 *
 * The field starts at one row and grows with its content up to 160px before it scrolls. React submitted on
 * Mod+Enter; a phone's return key has no modifier, so the keyboard inserts a newline and the Start button is
 * the submit path. The hint is a `Kbd keys="Mod+Enter"` chip, hidden on touch devices that have no hovering
 * fine pointer.
 *
 * @example
 * ```tsx
 * <TaskComposer
 *   value={draft}
 *   onValueChange={setDraft}
 *   onStart={start}
 *   pickers={<ComposerChip leading="R">Researcher</ComposerChip>}
 * />
 * ```
 */
export function TaskComposer({
  placeholder = "Describe a task for a bot",
  value,
  onValueChange,
  pickers,
  onStart,
  startLabel = "Start",
  style,
}: TaskComposerProps) {
  const theme = useHoronTheme();
  const { keyboardHints } = useDevice();
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const text = value ?? draft;
  const fieldText = useFieldText("body-sm", { multiline: true, empty: text === "" });

  return (
    <View
      style={[
        styles.composer,
        { backgroundColor: theme.color("overlay-ink-4") },
        focused && { boxShadow: `0 0 0 2px ${theme.color("text-brand")}` },
        style,
      ]}
    >
      <TextInput
        multiline
        value={text}
        onChangeText={(next) => {
          if (value === undefined) setDraft(next);
          onValueChange?.(next);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={theme.color("text-secondary")}
        accessibilityLabel={placeholder}
        maxFontSizeMultiplier={FIELD_MAX_FONT_SCALE}
        style={[styles.input, fieldText, { color: theme.color("text-primary") }]}
      />
      <View style={styles.footer}>
        {pickers ? <View style={styles.pickers}>{pickers}</View> : null}
        <View style={styles.spacer} />
        {keyboardHints ? <Kbd keys="Mod+Enter" /> : null}
        <HoronPressable
          role="button"
          pressScale
          onPress={onStart}
          style={({ pressed }) => [
            styles.start,
            {
              backgroundColor: theme.color(pressed ? "interactive-primary-hover" : "interactive-primary"),
              minHeight: theme.touch ? TOUCH_TARGET : 30,
            },
          ]}
        >
          <HoronText variant="label-sm" tone="text-inverse">
            {startLabel}
          </HoronText>
        </HoronPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    minWidth: 0,
    flexDirection: "column",
    alignItems: "stretch",
    gap: spacing["3"],
    borderRadius: radius.xl,
    borderWidth: 1,
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["4"],
    paddingBottom: spacing["2"],
  },
  filter: { flexDirection: "row" },
  chip: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1.5"],
    borderRadius: radius.full,
    paddingLeft: spacing["2"],
    paddingRight: spacing["2.5"],
  },
  chipTile: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xs,
  },
  chipIcon: { flexDirection: "row" },
  composer: {
    flexDirection: "column",
    gap: spacing["3.5"],
    borderRadius: radius.xl,
    paddingHorizontal: spacing["4"],
    paddingTop: spacing["3.5"],
    paddingBottom: spacing["2.5"],
  },
  input: { minHeight: 22, maxHeight: 160, padding: 0, textAlignVertical: "top" },
  footer: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["1.5"] },
  pickers: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["1.5"], minWidth: 0 },
  spacer: { flex: 1, minWidth: 0 },
  start: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    paddingHorizontal: spacing["3.5"],
  },
});
