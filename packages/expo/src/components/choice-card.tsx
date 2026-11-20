import { useContext, useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { HoronPressable } from "../lib/press";
import { duration, easing } from "../lib/motion";
import { RadioGroupContext } from "../lib/radio-group-context";
import { DISABLED_OPACITY } from "../lib/size";
import { HoronText } from "../lib/text";

/** Props for {@link ChoiceCard}: a radio's own selection plus the card's title, description and badge slots. */
export type ChoiceCardProps = {
  /** The value this card reports to its group when picked. */
  value: string;
  /** Locks this card on its own, on top of the lock the group applies. @default false */
  disabled?: boolean;
  /** Refuses a pick without dimming the card; stacks with the group's own `readOnly`. @default false */
  readOnly?: boolean;
  /** Card heading on the title line; `label-md` semibold primary text, wrapped onto as many lines as the card width allows. */
  title: ReactNode;
  /** Optional second line under the title, rendered as `caption` secondary text. */
  description?: ReactNode;
  /** Pill at the end of the title line, e.g. "Recommended": 22pt, 8pt padding, 18% sky with brand text. */
  badge?: ReactNode;
  /** `brand` (default) is 18% sky with brand text; `neutral` is 6% ink with secondary text. @default "brand" */
  badgeTone?: "brand" | "neutral";
  /** Accessible name of the card when its own text is not the name to announce. */
  "aria-label"?: string;
  /** Accessible name in React Native's own spelling; the same name as `aria-label`. */
  accessibilityLabel?: string;
  /** Outer layout, merged onto the card. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Paper `Choice card` (1VXM-0 selected, 1VXR-0 default): a 252pt solid card,
 * padding 14, radius 16, gap 12, with a 1pt default border that turns brand when
 * selected; no glass. Use inside a `RadioGroup`. The 18pt radio is a ring: 1.5pt
 * grey when off, an ink ring around an 8pt inverse core when on.
 *
 * The card is a radio root, so it belongs to a single-select group: `value` and
 * `defaultValue` on the group pick the card, a tap on any card moves the
 * selection, and `disabled` drops the card to 40% opacity and blocks the tap.
 * The radio mark is decorative; the card's own text is what a screen reader
 * announces, with `role="radio"` and its checked state.
 *
 * @example
 * ```tsx
 * import { ChoiceCard, RadioGroup } from "@horon-ai/expo";
 *
 * function Plan() {
 *   return (
 *     <RadioGroup defaultValue="team">
 *       <ChoiceCard value="solo" title="Solo" description="One workspace for yourself." />
 *       <ChoiceCard
 *         value="team"
 *         title="Team"
 *         description="Shared bots, memory and billing."
 *         badge="Recommended"
 *       />
 *     </RadioGroup>
 *   );
 * }
 * ```
 */
export function ChoiceCard({
  value,
  disabled = false,
  readOnly = false,
  title,
  description,
  badge,
  badgeTone = "brand",
  "aria-label": ariaLabel,
  accessibilityLabel,
  style,
}: ChoiceCardProps) {
  const theme = useHoronTheme();
  const group = useContext(RadioGroupContext);
  const [own, setOwn] = useState(false);
  const checked = group ? group.value === value : own;
  const dimmed = disabled || group?.disabled === true;
  const blocked = dimmed || readOnly || group?.readOnly === true;
  const [pop] = useState(() => new Animated.Value(checked ? 1 : 0));
  const still = theme.reducedMotion;

  useEffect(() => {
    if (still) {
      pop.setValue(checked ? 1 : 0);
      return undefined;
    }
    const show = Animated.timing(pop, {
      toValue: checked ? 1 : 0,
      duration: checked ? duration.popIn : duration.popOut,
      easing: checked ? easing.spring : easing.in,
      useNativeDriver: true,
    });
    show.start();
    return () => {
      show.stop();
    };
  }, [checked, pop, still]);

  const pick = () => {
    if (blocked) return;
    setOwn(true);
    group?.select(value);
  };

  return (
    <HoronPressable
      haptic="selection"
      role="radio"
      accessibilityLabel={accessibilityLabel ?? ariaLabel}
      accessibilityState={{ checked, disabled: dimmed }}
      disabled={dimmed}
      onPress={pick}
      style={({ pressed }) => [
        styles.root,
        {
          borderColor: theme.color(
            checked ? "border-brand" : pressed && !blocked ? "border-strong" : "border-default",
          ),
          backgroundColor: theme.color("bg-surface"),
        },
        dimmed && { opacity: DISABLED_OPACITY },
        style,
      ]}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[
          styles.mark,
          { borderColor: theme.color(checked ? "interactive-primary" : "border-dashed") },
          checked ? { backgroundColor: theme.color("interactive-primary") } : null,
        ]}
      >
        <Animated.View
          style={{
            width: 8,
            height: 8,
            borderRadius: radius.full,
            backgroundColor: theme.color("interactive-on-primary"),
            opacity: pop,
            transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
          }}
        />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <HoronText variant="label-md" style={styles.title}>
            {title}
          </HoronText>
          {badge === undefined || badge === null ? null : (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: theme.color(badgeTone === "brand" ? "accent-sky-500-18" : "overlay-ink-6"),
                },
              ]}
            >
              <HoronText variant="label-sm" tone={badgeTone === "brand" ? "text-brand" : "text-secondary"}>
                {badge}
              </HoronText>
            </View>
          )}
        </View>
        {description === undefined || description === null ? null : (
          <HoronText variant="caption" tone="text-secondary">
            {description}
          </HoronText>
        )}
      </View>
    </HoronPressable>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "relative",
    width: "100%",
    maxWidth: 252,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing["3"],
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: radius["2xl"],
    padding: spacing["3.5"],
    borderCurve: "continuous",
  },
  mark: {
    marginTop: 1,
    width: 18,
    height: 18,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: radius.full,
  },
  body: { position: "relative", minWidth: 0, flex: 1, gap: spacing["1"] },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing["2.5"] },
  title: { minWidth: 0, flex: 1, fontWeight: "600" },
  badge: {
    flexShrink: 0,
    height: 22,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    paddingHorizontal: spacing["2"],
  },
});
