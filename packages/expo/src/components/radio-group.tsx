import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { HoronPressable } from "../lib/press";
import { duration, easing } from "../lib/motion";
import { RadioGroupContext, type RadioGroupState } from "../lib/radio-group-context";
import { DISABLED_OPACITY, type ControlSize, touchSlop } from "../lib/size";
import { HoronText } from "../lib/text";

/**
 * Mark size of a radio, on the shared control scale: `sm` 16pt, `md` 20pt, `lg`
 * 24pt. The group sets it once for every radio inside.
 */
export type RadioSize = ControlSize;

/** The group owns the mark size: every radio in one list reads the same mark. */
const RadioSizeContext = createContext<ControlSize>("md");

/** Props for {@link RadioGroup}: the selection, the lock and the shared mark size. */
export type RadioGroupProps = {
  /** Value the caller owns. Passing it makes the group controlled. */
  value?: string;
  /** Value selected at first render when the caller does not own it. */
  defaultValue?: string;
  /** Fires with the chosen value when the selection changes. */
  onValueChange?: (value: string) => void;
  /** Locks every radio in the group. @default false */
  disabled?: boolean;
  /** Keeps every radio announced but refuses to change the selection. @default false */
  readOnly?: boolean;
  /**
   * Mark size for every `Radio` inside; a radio can still override it.
   * @default "md"
   */
  size?: RadioSize;
  /** Accessible name of the group. */
  "aria-label"?: string;
  /** Accessible name in React Native's own spelling; the same name as `aria-label`. */
  accessibilityLabel?: string;
  /** Outer layout, merged onto the group column. */
  style?: StyleProp<ViewStyle>;
  /** The radios or choice cards to group. */
  children?: ReactNode;
};

/**
 * Groups {@link Radio} items so only one can be selected, and shares one mark
 * size with all of them. It renders a vertical column with a 12pt gap, holds the
 * selection itself when `value` is not passed, and announces `radiogroup` with
 * its name. The selection travels through a context, which is what makes a tap
 * on one radio clear the previous one — and what a {@link ChoiceCard} inside the
 * group reads too.
 *
 * @example
 * ```tsx
 * import { Radio, RadioGroup } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <RadioGroup defaultValue="week" aria-label="Repeat">
 *       <Radio value="day" label="Every day" />
 *       <Radio value="week" label="Every week" />
 *     </RadioGroup>
 *   );
 * }
 * ```
 */
export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  readOnly = false,
  size = "md",
  "aria-label": ariaLabel,
  accessibilityLabel,
  style,
  children,
}: RadioGroupProps) {
  const [own, setOwn] = useState<string | undefined>(defaultValue);
  const selected = value === undefined ? own : value;

  // The context value is rebuilt only when the selection, a lock or the handler changes, so a
  // radio deep in a long list does not re-render on every keystroke elsewhere in the tree.
  const group = useMemo<RadioGroupState>(
    () => ({
      value: selected,
      select: (next: string) => {
        if (disabled || readOnly || next === selected) return;
        if (value === undefined) setOwn(next);
        onValueChange?.(next);
      },
      disabled,
      readOnly,
    }),
    [disabled, onValueChange, readOnly, selected, value],
  );

  return (
    <RadioSizeContext.Provider value={size}>
      <RadioGroupContext.Provider value={group}>
        <View
          role="radiogroup"
          accessibilityLabel={accessibilityLabel ?? ariaLabel}
          style={[styles.group, style]}
        >
          {children}
        </View>
      </RadioGroupContext.Provider>
    </RadioSizeContext.Provider>
  );
}

type Rung = { mark: number; dot: number; gap: number; text: "body-sm" | "body-md" | "body-lg" };

const RUNGS: Record<RadioSize, Rung> = {
  sm: { mark: 16, dot: 6, gap: spacing["2"], text: "body-sm" },
  md: { mark: 20, dot: 8, gap: spacing["2.5"], text: "body-md" },
  lg: { mark: 24, dot: 10, gap: spacing["3"], text: "body-lg" },
};

/** Props for {@link Radio}: the value it reports, its label and its own lock. */
export type RadioProps = {
  /** The value this radio reports to its group when picked, required as Base UI's `Radio.Root` has it. */
  value: string;
  /** Text or node after the mark; tapping it picks the radio because both sit in one row. */
  label?: ReactNode;
  /** Locks this radio on its own, on top of the lock the group applies. @default false */
  disabled?: boolean;
  /**
   * Refuses a pick without dimming the mark: the radio stays readable and
   * announced, but a tap never selects it. Stacks with the group's own
   * `readOnly`. @default false
   */
  readOnly?: boolean;
  /** Overrides the enclosing `RadioGroup` size. */
  size?: RadioSize;
  /** Accessible name when the row has no visible label. */
  "aria-label"?: string;
  /** Accessible name in React Native's own spelling; the same name as `aria-label`. */
  accessibilityLabel?: string;
  /** Outer layout, merged onto the row. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Figma `Radio` (58:239): a 20pt circle; checked fills with ink and an 8pt dot.
 *
 * The mark and the label share one tappable row, so the label text is a target
 * and the picked value travels to {@link RadioGroup}, which is what clears the
 * previous pick. The dot pops in on the token spring curve when the radio is
 * picked, and Reduce Motion shows it without the pop. Outside a group the radio
 * keeps its own flag, so a lone control still shows its selection.
 *
 * @example
 * ```tsx
 * import { Radio, RadioGroup } from "@horon-ai/expo";
 *
 * function Priority() {
 *   return (
 *     <RadioGroup size="sm" defaultValue="one" aria-label="Priority">
 *       <Radio value="one" label="Low" />
 *       <Radio value="two" label="High" />
 *     </RadioGroup>
 *   );
 * }
 * ```
 */
export function Radio({
  value,
  label,
  disabled = false,
  readOnly = false,
  size,
  "aria-label": ariaLabel,
  accessibilityLabel,
  style,
}: RadioProps) {
  const theme = useHoronTheme();
  const groupSize = useContext(RadioSizeContext);
  const group = useContext(RadioGroupContext);
  const [own, setOwn] = useState(false);
  const rung = RUNGS[size ?? groupSize];
  const dimmed = disabled || group?.disabled === true;
  const blocked = dimmed || readOnly || group?.readOnly === true;
  const isSelected = group ? group.value === value : own;
  const [pop] = useState(() => new Animated.Value(isSelected ? 1 : 0));
  const still = theme.reducedMotion;

  useEffect(() => {
    if (still) {
      pop.setValue(isSelected ? 1 : 0);
      return undefined;
    }
    const show = Animated.timing(pop, {
      toValue: isSelected ? 1 : 0,
      duration: isSelected ? duration.popIn : duration.popOut,
      easing: isSelected ? easing.spring : easing.in,
      useNativeDriver: true,
    });
    show.start();
    return () => {
      show.stop();
    };
  }, [isSelected, pop, still]);

  const pick = () => {
    if (blocked) return;
    setOwn(true);
    group?.select(value);
  };

  return (
    <HoronPressable
      haptic="selection"
      role="radio"
      accessibilityLabel={label === undefined ? (accessibilityLabel ?? ariaLabel) : undefined}
      accessibilityState={{ checked: isSelected, disabled: dimmed }}
      disabled={dimmed}
      hitSlop={touchSlop(theme.touch, rung.mark, rung.mark)}
      onPress={pick}
      style={[styles.row, { gap: rung.gap }, dimmed && { opacity: DISABLED_OPACITY }, style]}
    >
      {({ pressed }) => (
        <>
          <View
            style={[
              styles.mark,
              {
                width: rung.mark,
                height: rung.mark,
                borderColor: theme.color(
                  isSelected
                    ? pressed && !dimmed
                      ? "interactive-primary-hover"
                      : "interactive-primary"
                    : pressed && !dimmed
                      ? "text-secondary"
                      : "border-strong",
                ),
                backgroundColor: theme.color(
                  isSelected
                    ? pressed && !dimmed
                      ? "interactive-primary-hover"
                      : "interactive-primary"
                    : "bg-surface",
                ),
              },
            ]}
          >
            <Animated.View
              style={{
                width: rung.dot,
                height: rung.dot,
                borderRadius: radius.full,
                backgroundColor: theme.color("interactive-on-primary"),
                opacity: pop,
                transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
              }}
            />
          </View>
          {label === undefined ? null : (
            <HoronText variant={rung.text} style={styles.label}>
              {label}
            </HoronText>
          )}
        </>
      )}
    </HoronPressable>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: "column", gap: spacing["3"] },
  row: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", maxWidth: "100%" },
  label: { flexShrink: 1, minWidth: 0 },
  mark: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: radius.full,
  },
});
