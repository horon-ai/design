import { Children, isValidElement, useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Stop } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { fillFromClass } from "../lib/class-color";
import { HoronPressable } from "../lib/press";
import { duration, easing } from "../lib/motion";
import { TOUCH_TARGET } from "../lib/size";
import { HoronText } from "../lib/text";
import { SegmentedControl } from "./segmented-control";
import { Spinner } from "./spinner";

/** The lead bot row at the top of {@link OrchestratorPanel}. */
export type OrchestratorLead = {
  /** One letter shown in the 22px ink tile. */
  initial: string;
  /** Bot name, next to the tile. */
  name: ReactNode;
  /** Role caption next to the name, such as "Lead". Defaults to "Lead" when unset.
   * @default "Lead" */
  role?: ReactNode;
  /** Status text, such as "1 working". */
  status?: ReactNode;
  /** Shows the 13px spinner while the lead waits on its lanes. */
  running?: boolean;
  /** Timing label at the right, in caption colour. */
  elapsed?: ReactNode;
};

/** One step of the lead's plan, listed under its row. */
export type OrchestratorPlanItem = {
  /** Step text; also the React key, so keep steps unique. */
  label: string;
  /** Dot color of the lane that runs this step, as the react class, such as "bg-sky-600". Defaults to the live blue. */
  dotClassName?: string;
  /** Pulses the dot while the lane works. */
  running?: boolean;
};

/** The closing summary card of {@link OrchestratorPanel}. */
export type OrchestratorSummary = {
  /** Title of the card.
   * @default "Summary" */
  title?: ReactNode;
  /** Right-aligned count, such as "1 of 3 returned". */
  count?: ReactNode;
  /** Body text of the summary. */
  body: ReactNode;
};

/** Props for {@link OrchestratorPanel}: the header controls, the lead and its plan, the lanes and the summary. */
export type OrchestratorPanelProps = {
  /** Panel heading, rendered as the heading. */
  title: ReactNode;
  /** Label before the segmented picker, such as "Bots in parallel". @default "Bots in parallel" */
  parallelLabel?: ReactNode;
  /** Choices of the parallel picker. The picker only renders when this is set. */
  parallelOptions?: number[];
  /** Controlled picked value; the picker is uncontrolled-looking when unset. */
  parallelValue?: number;
  /** Fires with the picked number, converted from the segmented control's string value. */
  onParallelChange?: (value: number) => void;
  /** Text of the Stop button.
   * @default "Stop" */
  stopLabel?: ReactNode;
  /** Renders the Stop button when set. */
  onStop?: () => void;
  /** The lead row: tile, name, role, status and elapsed. */
  lead: OrchestratorLead;
  /** Steps under the lead; each row rises in with a 30ms stagger. Hides the list when empty. */
  plan?: OrchestratorPlanItem[];
  /** `AgentLane` cards; the branch connector draws one elbow per lane. */
  children?: ReactNode;
  /** Closing summary card; it rises in when set. */
  summary?: OrchestratorSummary;
  /** Layout of the panel, for margins or a width override. */
  style?: StyleProp<ViewStyle>;
};

/** Whether a value can sit in one line of text. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** The entrance of react's `motion-rise`: opacity and a 4px rise, once, skipped under Reduce Motion. */
function Rise({ delay = 0, style, children }: { delay?: number; style?: StyleProp<ViewStyle>; children: ReactNode }) {
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
      delay,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, progress, theme.reducedMotion]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** One plan dot; the running pulse loop is never started under Reduce Motion. */
function PlanDot({ fill, running }: { fill: string; running: boolean }) {
  const theme = useHoronTheme();
  const [pulse] = useState(() => new Animated.Value(0));
  const still = !running || theme.reducedMotion;

  useEffect(() => {
    if (still) return undefined;
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: duration.livePulse,
        easing: easing.outQuint,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => {
      loop.stop();
      pulse.setValue(0);
    };
  }, [pulse, still]);

  return (
    <View accessible={running} accessibilityLabel={running ? "Running" : undefined} style={styles.dotFrame}>
      {still ? null : (
        <Animated.View
          style={[
            styles.dotRing,
            {
              borderColor: fill,
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }),
              transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2] }) }],
            },
          ]}
        />
      )}
      <View style={[styles.dot, { backgroundColor: fill }]} />
    </View>
  );
}

/**
 * Figma `Orchestrator` (Agents N1): a 24px-radius solid panel, header with a parallel picker and Stop, a lead row, its plan,
 * branching lanes and a summary.
 *
 * Renders a lead bot that fans work out to lane cards: the connector draws one
 * elbow per child and a vertical trunk between them, and the plan rows and lane
 * cards rise in with a 30ms stagger. Every part is optional except `title` and
 * `lead`, so the panel works as a bare lead view too.
 *
 * @example
 * ```tsx
 * <OrchestratorPanel
 *   title="Orchestrator"
 *   parallelOptions={[1, 2, 3]}
 *   parallelValue={2}
 *   onParallelChange={setParallel}
 *   onStop={stop}
 *   lead={{ initial: "H", name: "Horon", status: "2 working", running: true }}
 *   plan={[{ label: "Collect sources" }, { label: "Draft the summary", running: true }]}
 *   summary={{ count: "0 of 2 returned", body: "Lanes are still running." }}
 * >
 *   <AgentLane status="running" bot={{ initial: "R", name: "Researcher" }} task="Collect sources" />
 * </OrchestratorPanel>
 * ```
 */
export function OrchestratorPanel({
  title,
  parallelLabel = "Bots in parallel",
  parallelOptions,
  parallelValue,
  onParallelChange,
  stopLabel = "Stop",
  onStop,
  lead,
  plan,
  children,
  summary,
  style,
}: OrchestratorPanelProps) {
  const theme = useHoronTheme();
  const lanes = Children.toArray(children);

  return (
    <View
      style={[
        styles.panel,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
        style,
      ]}
    >
      <View style={styles.header}>
        {isPlainText(title) ? (
          <HoronText variant="label-lg">{title}</HoronText>
        ) : (
          <View style={styles.shrink}>{title}</View>
        )}
        <View style={styles.controls}>
          {isPlainText(parallelLabel) ? (
            <HoronText variant="body-sm" tone="text-secondary">
              {parallelLabel}
            </HoronText>
          ) : (
            parallelLabel
          )}
          {parallelOptions ? (
            <SegmentedControl
              aria-label={typeof parallelLabel === "string" ? parallelLabel : undefined}
              size="sm"
              surface="inset"
              value={parallelValue === undefined ? undefined : String(parallelValue)}
              onValueChange={(next) => onParallelChange?.(Number(next))}
              items={parallelOptions.map((option) => ({ value: String(option), label: String(option) }))}
            />
          ) : null}
          <View style={styles.spacer} />
          {onStop ? (
            <HoronPressable
              role="button"
              pressScale
              onPress={onStop}
              style={({ pressed }) => [
                styles.stop,
                {
                  backgroundColor: theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6"),
                  minHeight: theme.touch ? TOUCH_TARGET : 30,
                },
              ]}
            >
              <Stop size={14} color={theme.color("text-primary")} />
              {isPlainText(stopLabel) ? <HoronText variant="label-sm">{stopLabel}</HoronText> : stopLabel}
            </HoronPressable>
          ) : null}
        </View>
      </View>
      <View style={[styles.separator, { backgroundColor: theme.color("overlay-ink-8") }]} />

      <View style={styles.body}>
        <View style={styles.lead}>
          <View style={[styles.leadTile, { backgroundColor: theme.color("interactive-primary") }]}>
            <HoronText variant="label-sm" tone="text-inverse">
              {lead.initial}
            </HoronText>
          </View>
          {isPlainText(lead.name) ? (
            <HoronText variant="label-lg" numberOfLines={1} style={styles.shrink}>
              {lead.name}
            </HoronText>
          ) : (
            <View style={styles.shrink}>{lead.name}</View>
          )}
          {isPlainText(lead.role ?? "Lead") ? (
            <HoronText variant="body-sm" tone="text-secondary" numberOfLines={1} style={styles.role}>
              {lead.role ?? "Lead"}
            </HoronText>
          ) : (
            <View style={styles.role}>{lead.role ?? "Lead"}</View>
          )}
          {lead.running ? <Spinner size={13} label="Running" /> : null}
          {lead.status ? (
            isPlainText(lead.status) ? (
              <HoronText variant="caption" tone="text-secondary">
                {lead.status}
              </HoronText>
            ) : (
              lead.status
            )
          ) : null}
          {lead.elapsed ? (
            isPlainText(lead.elapsed) ? (
              <HoronText variant="caption" tone="text-secondary">
                {lead.elapsed}
              </HoronText>
            ) : (
              lead.elapsed
            )
          ) : null}
        </View>

        {plan && plan.length > 0 ? (
          <View style={styles.plan}>
            {plan.map((item, index) => (
              <Rise key={item.label} delay={index * 30} style={styles.planRow}>
                <PlanDot fill={fillFromClass(theme, item.dotClassName, "status-live")} running={!!item.running} />
                <HoronText variant="body-sm" style={styles.shrink}>
                  {item.label}
                </HoronText>
              </Rise>
            ))}
          </View>
        ) : null}

        {lanes.length > 0 ? (
          <View style={styles.lanes}>
            {lanes.map((lane, index) => (
              <Rise
                key={isValidElement(lane) && lane.key != null ? lane.key : `lane-${index}`}
                delay={index * 30}
                style={styles.lane}
              >
                <View
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                  style={[styles.elbow, { borderColor: theme.color("overlay-ink-14") }]}
                />
                {index < lanes.length - 1 ? (
                  <View
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                    style={[styles.trunk, { borderColor: theme.color("overlay-ink-14") }]}
                  />
                ) : null}
                {lane}
              </Rise>
            ))}
          </View>
        ) : null}

        {summary ? (
          <Rise delay={lanes.length * 30}>
            <View style={[styles.summary, { backgroundColor: theme.color("overlay-ink-4") }]}>
              <View style={styles.summaryHead}>
                {isPlainText(summary.title ?? "Summary") ? (
                  <HoronText variant="label-md" style={styles.shrink}>
                    {summary.title ?? "Summary"}
                  </HoronText>
                ) : (
                  <View style={styles.shrink}>{summary.title ?? "Summary"}</View>
                )}
                {summary.count ? (
                  isPlainText(summary.count) ? (
                    <HoronText variant="caption" tone="text-secondary">
                      {summary.count}
                    </HoronText>
                  ) : (
                    summary.count
                  )
                ) : null}
              </View>
              {isPlainText(summary.body) ? (
                <HoronText variant="body-sm" tone="text-secondary">
                  {summary.body}
                </HoronText>
              ) : (
                summary.body
              )}
            </View>
          </Rise>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    minWidth: 0,
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "column",
    gap: spacing["3"],
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["4"],
    paddingBottom: spacing["3.5"],
  },
  controls: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["2.5"] },
  shrink: { minWidth: 0, flexShrink: 1 },
  spacer: { flex: 1, minWidth: 0 },
  stop: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing["1.5"],
    borderRadius: radius.full,
    paddingHorizontal: spacing["3"],
  },
  separator: { height: 1 },
  body: {
    flexDirection: "column",
    gap: spacing["2.5"],
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["4"],
    paddingBottom: spacing["5"],
  },
  lead: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["2"] },
  leadTile: {
    width: 22,
    height: 22,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xs,
  },
  role: { flex: 1, minWidth: 0, flexShrink: 1 },
  plan: {
    flexDirection: "column",
    gap: spacing["1.5"],
    paddingLeft: 30,
    paddingTop: spacing["0.5"],
    paddingBottom: spacing["1"],
  },
  planRow: { flexDirection: "row", alignItems: "center", gap: spacing["2.5"], minWidth: 0 },
  dotFrame: { width: 6, height: 6, flexShrink: 0, alignItems: "center", justifyContent: "center" },
  dot: { width: 6, height: 6, borderRadius: radius.full },
  dotRing: { position: "absolute", width: 6, height: 6, borderRadius: radius.full, borderWidth: 1 },
  lanes: {
    flexDirection: "column",
    gap: spacing["2.5"],
    paddingLeft: 30,
  },
  lane: { position: "relative" },
  elbow: {
    position: "absolute",
    top: 0,
    left: -30,
    width: 30,
    height: 22,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomLeftRadius: radius.lg,
  },
  trunk: { position: "absolute", top: 22, bottom: -10, left: -30, borderLeftWidth: 1.5 },
  summary: {
    flexDirection: "column",
    gap: spacing["1"],
    borderRadius: radius["2xl"],
    paddingHorizontal: spacing["4"],
    paddingVertical: spacing["3"],
  },
  summaryHead: { flexDirection: "row", alignItems: "center", gap: spacing["2"] },
});
