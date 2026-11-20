import { Children, useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Check } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { HoronPressable } from "../lib/press";
import { easing } from "../lib/motion";
import { DISABLED_OPACITY, type ControlSize, touchSlop } from "../lib/size";
import { wrapTextChildren } from "../lib/text";

/** Height and label rung of {@link Chip}; identical to {@link ControlSize} (`sm` 28pt, `md` 32pt, `lg` 36pt). */
export type ChipSize = ControlSize;

/**
 * Props of {@link Chip}: the toggle state Base UI's Toggle owned (`pressed`,
 * `defaultPressed`, `onPressedChange`, `disabled`) plus the rung.
 */
export type ChipProps = {
  /** Selected state the caller owns; a tap reports the next state but does not move the chip. */
  pressed?: boolean;
  /** Selected state at first render when the caller does not own it. @default false */
  defaultPressed?: boolean;
  /** Fires with the next selected state when the chip is tapped. */
  onPressedChange?: (pressed: boolean) => void;
  /** Blocks interaction and dims the chip to 40%. @default false */
  disabled?: boolean;
  /**
   * `md` is the 32pt Figma Chip; `sm` is 28pt and `lg` 36pt.
   * @default "md"
   */
  size?: ChipSize;
  /** The react call site's click handler; runs after the state change. */
  onClick?: () => void;
  /** Outer layout, merged onto the chip. */
  style?: StyleProp<ViewStyle>;
  /** The label; a plain string sets in the chip's type token, any node is laid out in a row at the label gap. */
  children?: ReactNode;
};

type Rung = { height: number; padding: number; glyph: number; text: "label-sm" | "label-md" | "label-lg" };

const RUNGS: Record<ChipSize, Rung> = {
  sm: { height: 28, padding: spacing["2.5"], glyph: 12, text: "label-sm" },
  md: { height: 32, padding: spacing["3"], glyph: 14, text: "label-md" },
  lg: { height: 36, padding: spacing["3.5"], glyph: 16, text: "label-lg" },
};

/** The gap between a chip's label pieces, react's `gap-1.5`. */
const LABEL_GAP = spacing["1.5"];

/** The 150ms width change of the check slot, react's `duration-150`. */
const OPEN = 150;

/** The open check slot's width: the glyph plus the label gap, matching the Figma measurements. */
const SLOT = { sm: 18, md: 22, lg: 26 } as const;

/**
 * Figma `Chip` (61:302): a 32pt solid toggle, no glass; selected shows a check,
 * the brand border and brand text.
 *
 * A Base UI–style toggle: `pressed` makes it controlled, otherwise it keeps its
 * own state and reports through `onPressedChange`. The check sits in a `0`-width
 * slot that opens on press, so an unselected chip never reserves the icon space;
 * the slot only animates after the first toggle, so a chip that mounts pressed
 * does not flash it. An element child is laid out in a row at the label gap.
 * With `touch` on, every rung grows to a 44pt target while the label keeps its
 * own step, and Reduce Motion opens the slot without the transition.
 *
 * @example
 * ```tsx
 * import { Chip } from "@horon-ai/expo";
 *
 * function Filters() {
 *   return (
 *     <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
 *       <Chip defaultPressed>Documents</Chip>
 *       <Chip>Images</Chip>
 *     </View>
 *   );
 * }
 * ```
 */
export function Chip({
  pressed,
  defaultPressed = false,
  onPressedChange,
  disabled = false,
  size = "md",
  onClick,
  style,
  children,
}: ChipProps) {
  const theme = useHoronTheme();
  const rung = RUNGS[size];
  const [own, setOwn] = useState(defaultPressed);
  const [toggled, setToggled] = useState(false);
  const isPressed = pressed ?? own;
  const [open] = useState(() => new Animated.Value(isPressed ? 1 : 0));
  const still = theme.reducedMotion;
  const hasElementChild = Children.toArray(children).some(
    (child) => typeof child !== "string" && typeof child !== "number",
  );

  useEffect(() => {
    if (still || !toggled) {
      open.setValue(isPressed ? 1 : 0);
      return undefined;
    }
    const grow = Animated.timing(open, {
      toValue: isPressed ? 1 : 0,
      duration: OPEN,
      easing: easing.outQuint,
      useNativeDriver: false,
    });
    grow.start();
    return () => grow.stop();
  }, [isPressed, open, still, toggled]);

  const toggle = () => {
    if (disabled) return;
    setToggled(true);
    const next = !isPressed;
    if (pressed === undefined) setOwn(next);
    onPressedChange?.(next);
    onClick?.();
  };

  return (
    <HoronPressable
      haptic="selection"
      pressScale
      role="button"
      accessibilityState={{ selected: isPressed, disabled }}
      disabled={disabled}
      hitSlop={touchSlop(theme.touch, rung.height)}
      onPress={toggle}
      style={({ pressed: down }) => [
        styles.root,
        {
          minHeight: theme.touch ? 44 : rung.height,
          paddingHorizontal: rung.padding,
          borderColor: theme.color(isPressed ? "border-brand" : "border-default"),
          backgroundColor: theme.color(down && !disabled ? "bg-subtle" : "bg-surface"),
        },
        disabled && { opacity: DISABLED_OPACITY },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: open.interpolate({ inputRange: [0, 1], outputRange: [0, SLOT[size]] }),
          overflow: "hidden",
          opacity: open,
        }}
      >
        <Check size={rung.glyph} weight="bold" color={theme.color("text-brand")} />
      </Animated.View>
      <View style={hasElementChild ? { flexDirection: "row", alignItems: "center", gap: LABEL_GAP } : null}>
        {wrapTextChildren(children, {
          variant: rung.text,
          tone: isPressed ? "text-brand" : "text-primary",
          numberOfLines: 1,
        })}
      </View>
    </HoronPressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: "flex-start",
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: radius.full,
    borderCurve: "continuous",
  },
});
