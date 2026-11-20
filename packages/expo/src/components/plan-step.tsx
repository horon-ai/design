import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { ArrowClockwise, Check } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken } from "../provider";
import { HoronPressable } from "../lib/press";
import { duration, easing } from "../lib/motion";
import { TOUCH_TARGET } from "../lib/size";
import { HoronText } from "../lib/text";
import { Spinner } from "./spinner";

/**
 * State of one step in a plan.
 *
 * - `done` — finished: sky marker with a check and a sky rail running to the next step.
 * - `running` — in progress: spinner on a subtle fill.
 * - `failed` — stopped with an error: danger marker with `!` and the error line expanded.
 * - `pending` — not started: outlined marker that shows the step number.
 */
export type PlanStepStatus = "done" | "running" | "failed" | "pending";

/**
 * Props for {@link PlanStep}. Only `status`, `index` and `title` are required; everything else is
 * optional decoration around the marker and the title line.
 */
export type PlanStepProps = {
  /** Current step state; drives the marker glyph, the marker fill and the rail color. */
  status: PlanStepStatus;
  /** Step number, shown on pending steps. */
  index: number;
  /** Step title; primary while done, running or failed, secondary while pending. */
  title: ReactNode;
  /** Secondary line under the title, next to the tool tag. */
  description?: ReactNode;
  /** Tool id in mono, such as "stripe.query". */
  tool?: ReactNode;
  /** Timing label at the right of the title; rendered only while `done` or `running`. */
  elapsed?: ReactNode;
  /** Error line under the title, revealed only when `status` is `failed`. */
  error?: ReactNode;
  /** Adds a "Retry from here" button in the expanded error block; it only renders while `status` is `failed`. */
  onRetry?: () => void;
  /** Hides the rail line under the last step. */
  last?: boolean;
  /** Layout of the row, for margins. */
  style?: StyleProp<ViewStyle>;
};

/** Human word of each step state, exposed through the marker's accessibility value. */
const statusWord: Record<PlanStepStatus, string> = {
  done: "Done",
  running: "Running",
  failed: "Failed",
  pending: "Not started",
};

/** Whether a value can sit in one line of text. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** The marker's cross-fade: a 220ms spring pop on every status change, skipped under Reduce Motion. */
function Pop({ children }: { children: ReactNode }) {
  const theme = useHoronTheme();
  const [progress] = useState(() => new Animated.Value(theme.reducedMotion ? 1 : 0));

  useEffect(() => {
    if (theme.reducedMotion) {
      progress.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: duration.popIn,
      easing: easing.spring,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, theme.reducedMotion]);

  return (
    <Animated.View
      style={[
        styles.glyph,
        {
          opacity: progress,
          transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** Fill and label of the 24px marker, per state. */
const marker: Record<PlanStepStatus, { fill?: ColorToken; border?: boolean; text?: ColorToken }> = {
  done: { fill: "status-live", text: "interactive-on-primary" },
  failed: { fill: "bg-danger", text: "text-danger" },
  pending: { border: true, text: "text-secondary" },
  running: { fill: "bg-subtle" },
};

/**
 * Figma `Plan step` (Agent plan 191:8296): a 24px marker on a 2px rail, sky when done.
 *
 * Stack the steps of an agent plan vertically and pass `last` to the final one so the rail stops
 * there. The marker cross-fades on every status change, and the error block shows only when the step
 * failed. The marker announces the step number as its label and the state as its value.
 *
 * @example
 * ```tsx
 * import { PlanStep } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <View>
 *       <PlanStep status="done" index={1} title="Read the brief" elapsed="2s" />
 *       <PlanStep status="running" index={2} title="Search the web" tool="web.search" />
 *       <PlanStep status="pending" index={3} title="Write the summary" last />
 *     </View>
 *   );
 * }
 * ```
 */
export function PlanStep({
  status,
  index,
  title,
  description,
  tool,
  elapsed,
  error,
  onRetry,
  last,
  style,
}: PlanStepProps) {
  const theme = useHoronTheme();
  const paint = marker[status];
  const failed = status === "failed";

  return (
    <View style={[styles.row, style]}>
      <View style={styles.markerColumn}>
        <View
          accessible
          accessibilityLabel={`Step ${index}`}
          accessibilityValue={{ text: statusWord[status] }}
          style={[
            styles.marker,
            {
              backgroundColor: paint.fill ? theme.color(paint.fill) : "transparent",
              borderWidth: paint.border ? 1 : 0,
              borderColor: theme.color("border-default"),
            },
          ]}
        >
          <Pop key={status}>
            {status === "done" ? <Check size={14} color={theme.color(paint.text ?? "text-primary")} /> : null}
            {status === "running" ? <Spinner size={20} label={statusWord.running} /> : null}
            {status === "failed" ? (
              <HoronText variant="label-sm" tone="text-danger">
                !
              </HoronText>
            ) : null}
            {status === "pending" ? (
              <HoronText variant="label-sm" tone="text-secondary">
                {index}
              </HoronText>
            ) : null}
          </Pop>
        </View>
        {last ? null : (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[
              styles.rail,
              { backgroundColor: theme.color(status === "done" ? "status-live" : "border-default") },
            ]}
          />
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          {isPlainText(title) ? (
            <HoronText
              variant="label-lg"
              tone={status === "pending" ? "text-secondary" : "text-primary"}
              style={styles.title}
            >
              {title}
            </HoronText>
          ) : (
            <View style={styles.title}>{title}</View>
          )}
          {elapsed && (status === "done" || status === "running") ? (
            isPlainText(elapsed) ? (
              <HoronText variant="caption" tone="text-secondary">
                {elapsed}
              </HoronText>
            ) : (
              elapsed
            )
          ) : null}
        </View>
        {description || tool ? (
          <View style={styles.meta}>
            {description ? (
              isPlainText(description) ? (
                <HoronText variant="body-sm" tone="text-secondary" style={styles.shrink}>
                  {description}
                </HoronText>
              ) : (
                <View style={styles.shrink}>{description}</View>
              )
            ) : null}
            {tool ? (
              <View style={[styles.tool, { backgroundColor: theme.color("bg-subtle") }]}>
                {isPlainText(tool) ? (
                  <HoronText variant="code" tone="text-secondary">
                    {tool}
                  </HoronText>
                ) : (
                  tool
                )}
              </View>
            ) : null}
          </View>
        ) : null}
        {failed ? (
          <View style={styles.error}>
            {isPlainText(error) ? (
              <HoronText variant="body-sm" tone="text-danger">
                {error}
              </HoronText>
            ) : (
              error
            )}
            {onRetry ? (
              <HoronPressable
                role="button"
                pressScale
                onPress={onRetry}
                style={({ pressed }) => [
                  styles.retry,
                  {
                    backgroundColor: theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6"),
                    minHeight: theme.touch ? TOUCH_TARGET : 30,
                  },
                ]}
              >
                <ArrowClockwise size={14} color={theme.color("text-primary")} />
                <HoronText variant="label-sm">Retry from here</HoronText>
              </HoronPressable>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minWidth: 0, flexDirection: "row", alignItems: "stretch", gap: spacing["3.5"] },
  markerColumn: { flexShrink: 0, flexDirection: "column", alignItems: "center", gap: spacing["1"] },
  marker: {
    width: 24,
    height: 24,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  glyph: { alignItems: "center", justifyContent: "center" },
  rail: { width: 2, flex: 1, borderRadius: radius.full },
  body: { flex: 1, minWidth: 0, flexDirection: "column", paddingTop: 2, paddingBottom: 18 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing["3"] },
  title: { flex: 1, minWidth: 0 },
  meta: {
    marginTop: spacing["1.5"],
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing["2"],
    rowGap: spacing["1.5"],
  },
  shrink: { minWidth: 0, flexShrink: 1 },
  tool: { borderRadius: radius.xs, paddingHorizontal: spacing["2"], paddingVertical: 2 },
  error: { marginTop: spacing["1.5"], flexDirection: "column", gap: spacing["1.5"] },
  retry: {
    width: "auto",
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1.5"],
    borderRadius: radius.full,
    paddingHorizontal: spacing["3"],
  },
});
