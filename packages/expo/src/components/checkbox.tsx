import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Check, Minus } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { HoronPressable } from "../lib/press";
import { duration, easing } from "../lib/motion";
import { DISABLED_OPACITY, type ControlSize, touchSlop } from "../lib/size";
import { HoronText } from "../lib/text";

/** Box size of {@link Checkbox}; identical to {@link ControlSize}. */
export type CheckboxSize = ControlSize;

/**
 * Props of {@link Checkbox}: the state props Base UI's checkbox root owned
 * (`checked`, `defaultChecked`, `onCheckedChange`, `indeterminate`, `disabled`,
 * `readOnly`) plus the label slot and the rung.
 */
export type CheckboxProps = {
  /**
   * Ticked state the caller owns. Passing it makes the control controlled: a tap
   * reports the next state through `onCheckedChange` but does not move the box.
   */
  checked?: boolean;
  /** Ticked state at first render when the caller does not own it. @default false */
  defaultChecked?: boolean;
  /** Fires with the next state when a tap asks to tick or untick the box. */
  onCheckedChange?: (checked: boolean) => void;
  /** Blocks interaction and dims the whole row; the box keeps its state. @default false */
  disabled?: boolean;
  /** Keeps the row announced but refuses to change the box. @default false */
  readOnly?: boolean;
  /** Draws the mixed state: a filled box with a dash instead of a check. @default false */
  indeterminate?: boolean;
  /** Label rendered after the box inside the same tappable row. */
  label?: ReactNode;
  /**
   * `md` is the 20pt Figma Checkbox, `sm` the 18pt box of the Data table
   * (192:9046), `lg` the 24pt box.
   * @default "md"
   */
  size?: CheckboxSize;
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Accessible name of the box when the row has no visible label. */
  "aria-label"?: string;
  /** Accessible name in React Native's own spelling; the same name as `aria-label`. */
  accessibilityLabel?: string;
  /** Outer layout, merged onto the row. */
  style?: StyleProp<ViewStyle>;
};

type Rung = { box: number; gap: number; glyph: number; text: "body-sm" | "body-md" | "body-lg" };

/** One 6pt corner at every size; only the box grows with the rung. */
const RUNGS: Record<CheckboxSize, Rung> = {
  sm: { box: 18, gap: spacing["2"], glyph: 12, text: "body-sm" },
  md: { box: 20, gap: spacing["2.5"], glyph: 14, text: "body-md" },
  lg: { box: 24, gap: spacing["3"], glyph: 16, text: "body-lg" },
};

/**
 * Figma `Checkbox` (58:217): a 20pt box, 6pt radius, with a 10pt gap to its label.
 *
 * The box and its label share one tappable row, so the text is a target too. A
 * controlled `checked` keeps the caller in charge; otherwise the control holds
 * its own state seeded by `defaultChecked`, and `indeterminate` draws the mixed
 * state that assistive technology reads as `mixed`. Checked and indeterminate
 * boxes fill with the brand colour and pop a check or a dash in on the token
 * spring curve; a disabled or read-only control dims and refuses the tap, and
 * Reduce Motion shows the glyph without the pop.
 *
 * @example
 * ```tsx
 * import { Checkbox } from "@horon-ai/expo";
 *
 * function Example() {
 *   return <Checkbox label="Remember this chat" defaultChecked />;
 * }
 * ```
 */
export function Checkbox({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  readOnly = false,
  indeterminate = false,
  label,
  size = "md",
  id,
  "aria-label": ariaLabel,
  accessibilityLabel,
  style,
}: CheckboxProps) {
  const theme = useHoronTheme();
  const rung = RUNGS[size];
  const [own, setOwn] = useState(defaultChecked);
  const isChecked = checked ?? own;
  const filled = isChecked || indeterminate;
  const [pop] = useState(() => new Animated.Value(filled ? 1 : 0));
  const still = theme.reducedMotion;

  useEffect(() => {
    if (still) {
      pop.setValue(filled ? 1 : 0);
      return undefined;
    }
    const show = Animated.timing(pop, {
      toValue: filled ? 1 : 0,
      duration: filled ? duration.popIn : duration.popOut,
      easing: filled ? easing.spring : easing.in,
      useNativeDriver: true,
    });
    show.start();
    return () => show.stop();
  }, [filled, pop, still]);

  const toggle = () => {
    if (disabled || readOnly) return;
    const next = !isChecked;
    if (checked === undefined) setOwn(next);
    onCheckedChange?.(next);
  };

  return (
    <HoronPressable
      nativeID={id}
      haptic="selection"
      role="checkbox"
      accessibilityLabel={label === undefined ? (accessibilityLabel ?? ariaLabel) : undefined}
      accessibilityState={{ checked: indeterminate ? "mixed" : isChecked, disabled }}
      disabled={disabled}
      hitSlop={touchSlop(theme.touch, rung.box, rung.box)}
      onPress={toggle}
      style={[styles.row, { gap: rung.gap }, disabled && { opacity: DISABLED_OPACITY }, style]}
    >
      {({ pressed }) => (
        <>
          <View
            style={[
              styles.box,
              {
                width: rung.box,
                height: rung.box,
                borderColor: theme.color(
                  filled
                    ? pressed && !disabled
                      ? "interactive-primary-hover"
                      : "interactive-primary"
                    : pressed && !disabled
                      ? "text-secondary"
                      : "border-strong",
                ),
                backgroundColor: theme.color(
                  filled
                    ? pressed && !disabled
                      ? "interactive-primary-hover"
                      : "interactive-primary"
                    : "bg-surface",
                ),
              },
            ]}
          >
            <Animated.View
              style={{
                opacity: pop,
                transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
              }}
            >
              {indeterminate ? (
                <Minus size={rung.glyph} weight="bold" color={theme.color("interactive-on-primary")} />
              ) : (
                <Check size={rung.glyph} weight="bold" color={theme.color("interactive-on-primary")} />
              )}
            </Animated.View>
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
  row: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", maxWidth: "100%" },
  label: { flexShrink: 1, minWidth: 0 },
  box: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: radius.xs,
    borderCurve: "continuous",
  },
});
