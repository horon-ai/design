import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { CheckCircle, IconContext, WarningCircle } from "phosphor-react-native";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { useIconContext } from "../lib/icon";
import { duration, easing } from "../lib/motion";
import { HoronText } from "../lib/text";
import { Spinner } from "./spinner";

/** Lifecycle of the lane: `running` shows a spinner and a pulsing tile, `done` a check, `failed` a warning and a danger rim. */
export type AgentLaneStatus = "running" | "done" | "failed";

/** Props for {@link AgentLane}: the sub-agent identity, its task, and the optional tool, output, usage and timing lines. */
export type AgentLaneProps = {
  /** Lifecycle state; also picks the tile shade (sky-400, sky-600, sky-800) and the result icon. */
  status: AgentLaneStatus;
  /** Identity of the sub-agent shown in the header. */
  bot: {
    /** One-character tile label, usually the first letter of the name. */
    initial: string;
    /** Display name, truncated when the header runs out of room. */
    name: ReactNode;
  };
  /** Duration, such as "1.9s". */
  elapsed?: ReactNode;
  /** The short task line under the header, wrapping onto several lines. */
  task: ReactNode;
  /** 14px tool icon and source, such as "Notion · Q3 metrics dashboard". */
  tool?: {
    /** Tool icon, sized 14px by the row. */
    icon: ReactNode;
    /** Tool and source description, truncated to one line. */
    label: ReactNode;
  };
  /** Latest output, or the error when failed. */
  output?: ReactNode;
  /** Usage caption, such as "2.6k tokens". */
  usage?: ReactNode;
  /** Layout of the card, for the lane grid. */
  style?: StyleProp<ViewStyle>;
};

const botTile: Record<AgentLaneStatus, string> = {
  running: primitives["sky-400"],
  done: primitives["sky-600"],
  failed: primitives["sky-800"],
};

/** Human word of each lane state, for the glyph's accessibility label and value. */
const statusWord: Record<AgentLaneStatus, string> = { running: "Running", done: "Done", failed: "Failed" };

/** Whether a value can sit in one line of text. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** The tile's expanding ring while the lane runs; it is never started under Reduce Motion. */
function Tile({ status, initial }: { status: AgentLaneStatus; initial: string }) {
  const theme = useHoronTheme();
  const [pulse] = useState(() => new Animated.Value(0));
  const running = status === "running";
  const still = theme.reducedMotion || !running;

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
    <View style={styles.tileFrame}>
      {running ? (
        <Animated.View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[
            styles.pulseRing,
            {
              borderColor: theme.color("accent-sky-500-20"),
              opacity: still ? 0 : pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
              transform: [{ scale: still ? 1 : pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] }) }],
            },
          ]}
        />
      ) : null}
      <View style={[styles.tile, { backgroundColor: botTile[status] }]}>
        <HoronText variant="label-sm" tone="text-inverse">
          {initial}
        </HoronText>
      </View>
    </View>
  );
}

/**
 * Figma `Agent lane` (Agent orchestrator 113:953): one sub-agent's card in a fan-out, flat subtle with a red
 * rim on failure.
 *
 * The running tile draws its expanding ring with `Animated` and stops it under Reduce Motion; the result
 * glyph carries the state as its accessibility label and value, and the running spinner announces "Running".
 *
 * @example
 * ```tsx
 * <AgentLane
 *   status="running"
 *   bot={{ initial: "R", name: "Researcher" }}
 *   task="Gather the Q3 metrics"
 *   elapsed="1.9s"
 * />
 * ```
 */
export function AgentLane({ status, bot, elapsed, task, tool, output, usage, style }: AgentLaneProps) {
  const theme = useHoronTheme();
  const toolIcon = useIconContext({ color: theme.color("text-secondary"), size: 14 });
  return (
    <View
      style={[
        styles.card,
        {
          borderColor: theme.color(status === "failed" ? "border-danger" : "border-default"),
          backgroundColor: theme.color("bg-surface"),
        },
        style,
      ]}
    >
      <View style={styles.header}>
        <Tile status={status} initial={bot.initial} />
        <View style={styles.name}>
          {isPlainText(bot.name) ? (
            <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
              {bot.name}
            </HoronText>
          ) : (
            bot.name
          )}
        </View>
        <View
          style={styles.glyph}
          accessible={status !== "running"}
          accessibilityLabel={status === "running" ? undefined : statusWord[status]}
          accessibilityValue={status === "running" ? undefined : { text: status }}
        >
          {status === "running" ? <Spinner size={12} label={statusWord.running} /> : null}
          {status === "done" ? <CheckCircle size={14} color={theme.color("text-secondary")} /> : null}
          {status === "failed" ? <WarningCircle size={14} color={theme.color("text-danger")} /> : null}
        </View>
        {elapsed ? (
          isPlainText(elapsed) ? (
            <HoronText variant="caption" tone="text-secondary" style={styles.elapsed}>
              {elapsed}
            </HoronText>
          ) : (
            elapsed
          )
        ) : null}
      </View>
      {isPlainText(task) ? <HoronText variant="label-lg">{task}</HoronText> : <View style={styles.shrink}>{task}</View>}
      {tool ? (
        <View style={styles.tool}>
          <IconContext.Provider value={toolIcon}>
            <View style={styles.toolIcon}>{tool.icon}</View>
          </IconContext.Provider>
          {isPlainText(tool.label) ? (
            <HoronText variant="caption" tone="text-secondary" numberOfLines={1} style={styles.grow}>
              {tool.label}
            </HoronText>
          ) : (
            <View style={[styles.grow, styles.shrink]}>{tool.label}</View>
          )}
        </View>
      ) : null}
      {output ? (
        isPlainText(output) ? (
          <HoronText variant="body-sm" tone={status === "failed" ? "text-danger" : "text-primary"}>
            {output}
          </HoronText>
        ) : (
          <View style={styles.shrink}>{output}</View>
        )
      ) : null}
      {usage ? (
        isPlainText(usage) ? (
          <HoronText variant="caption" tone="text-secondary">
            {usage}
          </HoronText>
        ) : (
          usage
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 0,
    flexDirection: "column",
    gap: spacing["1.5"],
    borderRadius: radius["2xl"],
    borderWidth: 1,
    paddingHorizontal: spacing["4"],
    paddingVertical: spacing["3"],
  },
  header: { flexDirection: "row", alignItems: "center", gap: spacing["2"] },
  tileFrame: { width: 18, height: 18, flexShrink: 0, alignItems: "center", justifyContent: "center" },
  pulseRing: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: radius.xs,
    borderWidth: 1,
  },
  tile: {
    width: 18,
    height: 18,
    borderRadius: radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { flex: 1, minWidth: 0 },
  glyph: { width: 14, height: 14, alignItems: "center", justifyContent: "center" },
  elapsed: { flexShrink: 0, fontVariant: ["tabular-nums"] },
  tool: { flexDirection: "row", alignItems: "center", gap: spacing["1.5"] },
  toolIcon: { flexShrink: 0 },
  grow: { flex: 1, minWidth: 0 },
  shrink: { minWidth: 0 },
});
