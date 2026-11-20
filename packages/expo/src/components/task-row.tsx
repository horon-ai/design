import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Archive, ArrowClockwise, CheckCircle, Folder, Stop, WarningCircle } from "phosphor-react-native";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken, type HoronTheme } from "../provider";
import { fillFromClass } from "../lib/class-color";
import { HoronPressable } from "../lib/press";
import { duration, easing } from "../lib/motion";
import { TOUCH_TARGET } from "../lib/size";
import { HoronText } from "../lib/text";
import { Spinner } from "./spinner";

/**
 * Task lifecycle states a {@link TaskRow} renders: `running` shows a spinner and Cancel,
 * `review` a check and Review, `failed` a warning and Retry, `done` a muted check and Archive.
 */
export type TaskStatus = "running" | "review" | "failed" | "done";

/** Props of {@link TaskRow}: the task's state and texts plus the actions offered for that state. */
export type TaskRowProps = {
  /** Drives the status icon, the message color and which actions appear. */
  status: TaskStatus;
  /** Task name, one truncated line at `label-lg`. */
  title: ReactNode;
  /** Elapsed time, such as "1m 56s". */
  elapsed?: ReactNode;
  /** Bot initial and name. */
  bot: {
    /** One or two characters shown in the 18px tile; falls back to the status color when `tileClassName` is absent. */
    initial: string;
    /** Bot name after the tile, kept on one line. */
    name: ReactNode;
    /** Overrides the status-driven tile fill as the react background class; the text is forced to inverse when set. */
    tileClassName?: string;
  };
  /** Project shown after the bot name, separated by a dot and a folder icon. */
  project?: ReactNode;
  /** Status line: the current step, the result or the error. */
  message: ReactNode;
  /** Caption after the message, such as "2 drafts · 1 calendar change". */
  detail?: ReactNode;
  /** Called by the Cancel pill; shown only while `running`. */
  onCancel?: () => void;
  /** Called by the Retry pill; shown only when `failed`. */
  onRetry?: () => void;
  /** Called by the Review pill; shown only when `review`. */
  onReview?: () => void;
  /** Called by the archive icon button; shown when `review` or `done`. */
  onArchive?: () => void;
  /** `card` is a standalone subtle row; `list` is transparent with a 1px divider, for stacking inside a list. @default "card" */
  variant?: "card" | "list";
  /** Layout of the row, for margins. */
  style?: StyleProp<ViewStyle>;
};

/** Tile fill and label of the bot initial per state, unless `tileClassName` overrides the fill. */
function tilePaint(theme: HoronTheme, status: TaskStatus): { fill: string; label: string } {
  if (status === "review") return { fill: primitives["sky-500"], label: primitives["sky-50"] };
  if (status === "failed") return { fill: primitives["sky-700"], label: primitives["sky-50"] };
  return { fill: theme.color("interactive-primary"), label: theme.color("interactive-on-primary") };
}

/** Human word of each state, exposed through the message row's accessibility value. */
const statusWord: Record<TaskStatus, string> = {
  running: "Running",
  review: "In review",
  failed: "Failed",
  done: "Done",
};

/** Whether a value can sit in one line of text. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** The status icon's pop and the message's fade: one 220ms entrance per state, skipped under Reduce Motion. */
function Pop({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
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
        style,
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

/** The message's 160ms fade-in when the state changes. */
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
 * Figma `Task row` (Agent tasks 112:939): a flat subtle row, 16px radius, with Running / Review / Failed / Done.
 *
 * The status drives the icon, the message color and the one primary action offered: Cancel while
 * running, Retry when failed, Review when waiting for a person, and Archive once review or done.
 * Every state change animates the status icon in with the shared pop. The message row announces its
 * state through its accessibility value.
 *
 * @example
 * ```tsx
 * import { TaskRow } from "@horon-ai/expo";
 *
 * function RunningTask() {
 *   return (
 *     <TaskRow
 *       status="running"
 *       title="Draft the Q4 launch note"
 *       elapsed="1m 56s"
 *       bot={{ initial: "H", name: "Horon" }}
 *       project="Launch"
 *       message="Writing the second draft"
 *       detail="2 drafts · 1 calendar change"
 *       onCancel={() => cancelTask("launch-note")}
 *     />
 *   );
 * }
 * ```
 */
export function TaskRow({
  status,
  title,
  elapsed,
  bot,
  project,
  message,
  detail,
  onCancel,
  onRetry,
  onReview,
  onArchive,
  variant = "card",
  style,
}: TaskRowProps) {
  const theme = useHoronTheme();
  const pillBackground = (pressed: boolean) => theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6");
  const messageTone: ColorToken =
    status === "failed" ? "text-danger" : status === "done" ? "text-secondary" : "text-primary";

  return (
    <View
      style={[
        styles.row,
        variant === "card"
          ? {
              borderRadius: radius["2xl"],
              borderWidth: 1,
              borderColor: theme.color("border-default"),
              backgroundColor: theme.color("bg-surface"),
            }
          : [styles.listRow, { borderBottomColor: theme.color("overlay-ink-8") }],
        style,
      ]}
    >
      <View style={styles.titleRow}>
        {isPlainText(title) ? (
          <HoronText variant="label-lg" numberOfLines={1} style={styles.title}>
            {title}
          </HoronText>
        ) : (
          <View style={styles.title}>{title}</View>
        )}
        {elapsed ? (
          isPlainText(elapsed) ? (
            <HoronText variant="caption" tone="text-secondary">
              {elapsed}
            </HoronText>
          ) : (
            elapsed
          )
        ) : null}
      </View>

      <View style={styles.meta}>
        <View
          style={[
            styles.tile,
            {
              backgroundColor: bot.tileClassName
                ? fillFromClass(theme, bot.tileClassName, "interactive-primary")
                : tilePaint(theme, status).fill,
            },
          ]}
        >
          <HoronText
            variant="label-sm"
            style={{ color: bot.tileClassName ? theme.color("text-inverse") : tilePaint(theme, status).label }}
          >
            {bot.initial}
          </HoronText>
        </View>
        {isPlainText(bot.name) ? (
          <HoronText variant="caption" tone="text-secondary">
            {bot.name}
          </HoronText>
        ) : (
          bot.name
        )}
        {project ? (
          <>
            <HoronText variant="caption" tone="text-secondary" accessibilityElementsHidden>
              ·
            </HoronText>
            <Folder size={14} color={theme.color("text-secondary")} />
            {isPlainText(project) ? (
              <HoronText variant="caption" tone="text-secondary" numberOfLines={1} style={styles.shrink}>
                {project}
              </HoronText>
            ) : (
              <View style={styles.shrink}>{project}</View>
            )}
          </>
        ) : null}
      </View>

      <View style={styles.statusRow}>
        <View accessible accessibilityValue={{ text: statusWord[status] }} style={styles.messageRow}>
          <View style={styles.glyph}>
            {status === "running" ? (
              <Pop key="running">
                <Spinner size={15} label={statusWord.running} />
              </Pop>
            ) : null}
            {status === "review" ? (
              <Pop key="review">
                <CheckCircle size={16} color={theme.color("text-primary")} />
              </Pop>
            ) : null}
            {status === "done" ? (
              <Pop key="done">
                <CheckCircle size={16} color={theme.color("text-secondary")} />
              </Pop>
            ) : null}
            {status === "failed" ? (
              <Pop key="failed">
                <WarningCircle size={16} color={theme.color("text-danger")} />
              </Pop>
            ) : null}
          </View>
          {isPlainText(message) ? (
            <Fade key={status}>
              <HoronText variant="label-md" tone={messageTone} numberOfLines={1}>
                {message}
              </HoronText>
            </Fade>
          ) : (
            message
          )}
          {detail ? (
            <>
              <HoronText variant="caption" tone="text-secondary" accessibilityElementsHidden>
                ·
              </HoronText>
              {isPlainText(detail) ? (
                <HoronText variant="caption" tone="text-secondary" numberOfLines={1} style={styles.shrink}>
                  {detail}
                </HoronText>
              ) : (
                <View style={styles.shrink}>{detail}</View>
              )}
            </>
          ) : null}
        </View>
        <View style={styles.spacer} />

        {status === "running" ? (
          <HoronPressable
            role="button"
            pressScale
            onPress={onCancel}
            style={({ pressed }) => [
              styles.pill,
              { backgroundColor: pillBackground(pressed) },
              theme.touch && styles.tallPill,
            ]}
          >
            <Stop size={14} color={theme.color("text-primary")} />
            <HoronText variant="label-sm">Cancel</HoronText>
          </HoronPressable>
        ) : null}
        {status === "failed" ? (
          <HoronPressable
            role="button"
            pressScale
            onPress={onRetry}
            style={({ pressed }) => [
              styles.pill,
              { backgroundColor: pillBackground(pressed) },
              theme.touch && styles.tallPill,
            ]}
          >
            <ArrowClockwise size={14} color={theme.color("text-primary")} />
            <HoronText variant="label-sm">Retry</HoronText>
          </HoronPressable>
        ) : null}
        {status === "review" ? (
          <HoronPressable
            role="button"
            pressScale
            onPress={onReview}
            style={({ pressed }) => [
              styles.pill,
              { backgroundColor: theme.color(pressed ? "interactive-primary-hover" : "interactive-primary") },
              theme.touch && styles.tallPill,
            ]}
          >
            <HoronText variant="label-sm" tone="text-inverse">
              Review
            </HoronText>
          </HoronPressable>
        ) : null}
        {status === "review" || status === "done" ? (
          <HoronPressable
            role="button"
            pressScale
            accessibilityLabel="Archive"
            onPress={onArchive}
            style={({ pressed }) => [
              styles.archive,
              {
                width: theme.touch ? TOUCH_TARGET : 30,
                height: theme.touch ? TOUCH_TARGET : 30,
                backgroundColor: pressed ? theme.color("overlay-ink-6") : "transparent",
              },
            ]}
          >
            <Archive size={16} color={theme.color("text-secondary")} />
          </HoronPressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "column",
    gap: spacing["2"],
    paddingHorizontal: spacing["4"],
    paddingVertical: spacing["3.5"],
  },
  listRow: { position: "relative", borderBottomWidth: 1 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing["2"] },
  title: { flex: 1, minWidth: 0 },
  meta: { flexDirection: "row", alignItems: "center", gap: spacing["1.5"] },
  tile: {
    width: 18,
    height: 18,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xs,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing["2"],
    rowGap: spacing["1.5"],
    paddingTop: spacing["0.5"],
  },
  messageRow: { flexDirection: "row", alignItems: "center", columnGap: spacing["2"], minWidth: 0, flexShrink: 1 },
  glyph: { width: 16, height: 16, flexShrink: 0, alignItems: "center", justifyContent: "center" },
  shrink: { minWidth: 0, flexShrink: 1 },
  spacer: { flex: 1, minWidth: 0 },
  pill: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing["1.5"],
    height: 30,
    borderRadius: radius.full,
    paddingHorizontal: spacing["3"],
  },
  tallPill: { height: TOUCH_TARGET },
  archive: { flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: radius.full },
});
