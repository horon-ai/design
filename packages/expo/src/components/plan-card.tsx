import { useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { ListChecks, WarningCircle } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { duration, easing } from "../lib/motion";
import { HoronText } from "../lib/text";
import { Spinner } from "./spinner";

/**
 * Footer state of a `PlanCard`: at most one at a time, and setting it expands the
 * footer.
 *
 * - `running` shows a 14px spinner and keeps the footer text in the primary colour.
 * - `failed` shows a warning icon and tints the footer text with `text-text-danger`.
 */
export type PlanCardStatus = "running" | "failed";

/** Props for {@link PlanCard}: a label, title and step list, plus the optional status footer. */
export type PlanCardProps = {
  /** Label line next to the 16px list icon, such as "Plan · 5 steps". */
  label?: ReactNode;
  /** Plan title, rendered as the heading under the label. */
  title: ReactNode;
  /** `PlanStep`s, stacked without dividers. */
  children?: ReactNode;
  /** Footer state. Unset hides the footer; a change expands or collapses it. */
  status?: PlanCardStatus;
  /** Footer text, such as "Stopped · step 4 failed" or "Running · 1 of 5". */
  statusLabel?: ReactNode;
  /** Right-aligned footer timestamp or duration, kept in caption colour. */
  elapsed?: ReactNode;
  /** Layout of the card, for margins or a width override. */
  style?: StyleProp<ViewStyle>;
};

/** Whether a value can sit in one line of text. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** The footer text's re-entry: a 160ms fade when `status` changes, skipped under Reduce Motion. */
function Fade({ children }: { children: ReactNode }) {
  const theme = useHoronTheme();
  const [opacity] = useState(() => new Animated.Value(theme.reducedMotion ? 1 : 0));

  useEffect(() => {
    if (theme.reducedMotion) {
      opacity.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(opacity, {
      toValue: 1,
      duration: duration.fadeIn,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [opacity, theme.reducedMotion]);

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}

/**
 * Figma `Plan card` (Agents N3): a 20px-radius solid card with a label, title, the steps and a status footer.
 *
 * React kept the footer mounted inside a `Collapsible` so passing and clearing `status` animated the
 * collapse. React Native has no collapsible primitive, so the footer stays mounted and its measured
 * height is animated to zero in 240ms with the emphasized easing; the footer text fades in again only
 * when `status` changes, and the footer row announces the state through its accessibility value.
 *
 * @example
 * ```tsx
 * <PlanCard label="Plan · 3 steps" title="Ship the parser" status="running" statusLabel="Running · 1 of 3">
 *   <PlanStep status="done" index={1} title="Read the spec" />
 *   <PlanStep status="running" index={2} title="Write the parser" />
 *   <PlanStep status="pending" index={3} title="Publish" last />
 * </PlanCard>
 * ```
 */
export function PlanCard({ label, title, children, status, statusLabel, elapsed, style }: PlanCardProps) {
  const theme = useHoronTheme();
  const [contentHeight, setContentHeight] = useState(0);
  const [height] = useState(() => new Animated.Value(0));
  const [opacity] = useState(() => new Animated.Value(status === undefined ? 0 : 1));
  /** The first measurement places the footer without animating from a made-up height. */
  const measured = useRef(false);

  useEffect(() => {
    const open = status !== undefined;
    const time = theme.reducedMotion ? 0 : 240;
    const target = open ? contentHeight : 0;
    if (contentHeight === 0) {
      height.setValue(0);
      opacity.setValue(open ? 1 : 0);
      return undefined;
    }
    if (!measured.current) {
      measured.current = true;
      height.setValue(target);
      opacity.setValue(open ? 1 : 0);
      return undefined;
    }
    const animation = Animated.parallel([
      Animated.timing(height, { toValue: target, duration: time, easing: easing.outQuint, useNativeDriver: false }),
      Animated.timing(opacity, {
        toValue: open ? 1 : 0,
        duration: time,
        easing: easing.outQuint,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [contentHeight, height, opacity, status, theme.reducedMotion]);

  return (
    <View
      style={[
        styles.card,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
        style,
      ]}
    >
      <View style={styles.header}>
        {label ? (
          <View style={styles.label}>
            <ListChecks size={16} color={theme.color("text-secondary")} />
            {isPlainText(label) ? (
              <HoronText variant="body-sm" tone="text-secondary" style={styles.shrink}>
                {label}
              </HoronText>
            ) : (
              <View style={styles.shrink}>{label}</View>
            )}
          </View>
        ) : null}
        {isPlainText(title) ? (
          <HoronText role="heading" variant="label-lg" style={styles.title}>
            {title}
          </HoronText>
        ) : (
          <View style={styles.shrink}>{title}</View>
        )}
      </View>
      <View style={styles.steps}>{children}</View>
      <Animated.View
        accessibilityElementsHidden={status === undefined}
        importantForAccessibility={status === undefined ? "no-hide-descendants" : "auto"}
        style={{ height: contentHeight === 0 ? undefined : height, opacity, overflow: "hidden" }}
      >
        <View onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}>
          <View style={[styles.divider, { backgroundColor: theme.color("overlay-ink-8") }]} />
          <View
            accessible
            accessibilityLabel={isPlainText(statusLabel) ? String(statusLabel) : undefined}
            accessibilityValue={status === undefined ? undefined : { text: status }}
            style={styles.footer}
          >
            {status === "running" ? <Spinner size={14} /> : null}
            {status === "failed" ? <WarningCircle size={16} color={theme.color("text-danger")} /> : null}
            <View style={styles.footerText}>
              <Fade key={String(status)}>
                {isPlainText(statusLabel) ? (
                  <HoronText variant="label-md" tone={status === "failed" ? "text-danger" : "text-primary"}>
                    {statusLabel}
                  </HoronText>
                ) : (
                  statusLabel
                )}
              </Fade>
            </View>
            {elapsed ? (
              <Fade key={elapsed ? "with-elapsed" : "without-elapsed"}>
                {isPlainText(elapsed) ? (
                  <HoronText variant="caption" tone="text-secondary">
                    {elapsed}
                  </HoronText>
                ) : (
                  elapsed
                )}
              </Fade>
            ) : null}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minWidth: 0,
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "column",
    gap: spacing["2"],
    paddingHorizontal: spacing["6"],
    paddingTop: spacing["5"],
    paddingBottom: spacing["3.5"],
  },
  label: { flexDirection: "row", alignItems: "center", gap: spacing["2"], minWidth: 0 },
  title: { fontWeight: "600" },
  shrink: { minWidth: 0, flexShrink: 1 },
  steps: {
    flexDirection: "column",
    paddingHorizontal: spacing["6"],
    paddingTop: spacing["1.5"],
    paddingBottom: spacing["1"],
  },
  divider: { height: 1 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    minWidth: 0,
    paddingHorizontal: spacing["6"],
    paddingTop: spacing["3.5"],
    paddingBottom: spacing["4"],
  },
  footerText: { flex: 1, minWidth: 0 },
});
