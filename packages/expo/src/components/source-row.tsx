import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Check, IconContext, WarningCircle } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { useMediaQuery } from "../hooks/use-media-query";
import { easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { TOUCH_TARGET, touchSlop } from "../lib/size";
import { HoronText } from "../lib/text";

/**
 * Overall state of an indexed source: `ready` when every stage finished, `indexing` while the
 * pipeline runs, and `failed` when a stage broke and Retry is offered.
 */
export type SourceStatus = "ready" | "indexing" | "failed";

/** Props of {@link SourceRow}: the source's identity, its pipeline state and the Retry action. */
export type SourceRowProps = {
  /** Drives the default stage states, the detail colour and which trailing control appears. */
  status: SourceStatus;
  /** 16pt source icon on the 32pt tile. */
  icon: ReactNode;
  /** Source name, one truncated line at `label-md`. */
  name: ReactNode;
  /** Pages and chunks, progress, or the error. */
  detail: ReactNode;
  /** 0-100 while indexing. @default 0 */
  progress?: number;
  /** Called by the Retry button, which only appears when `status` is `failed`. */
  onRetry?: () => void;
  /** `card` is a standalone subtle row; `list` is transparent with a 1pt divider, for stacking inside a list. @default "card" */
  variant?: "card" | "list";
  /** Pipeline stage states; defaults to Parse, Chunk, Embed, Index derived from `status`. @default `defaultStages[status]`: `ready` is all `done`, `indexing` is `done, done, active, todo`, `failed` is `done, done, failed, todo` */
  stages?: SourceStages;

};

/**
 * One stage of the parse → chunk → embed → index pipeline: `done` is a 35% ink bar, `active`
 * shows the live progress fill, `todo` is 8% ink and `failed` takes the red accent.
 */
export type SourceStage = "done" | "active" | "todo" | "failed";

/** The four pipeline stages in display order: parse, chunk, embed, index. */
export type SourceStages = [SourceStage, SourceStage, SourceStage, SourceStage];
const stageNames = ["parse", "chunk", "embed", "index"] as const;

const defaultStages: Record<SourceStatus, SourceStages> = {
  ready: ["done", "done", "done", "done"],
  indexing: ["done", "done", "active", "todo"],
  failed: ["done", "done", "failed", "todo"],
};

const stageFill = { done: "overlay-ink-35", todo: "overlay-ink-8", failed: "accent-red-500-90" } as const;

/** Whether a value can be dropped into a `HoronText` as its child; an element renders as itself. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** The active bar grows over 400ms, react's `transition-[width] duration-400`. */
const GROW_MS = 400;

/** The four stage bars, 24pt wide or 44pt from 640pt up, in display order. */
function StageBars({ stages, progress }: { stages: SourceStages; progress: number }) {
  const theme = useHoronTheme();
  const wide = useMediaQuery("(min-width: 640px)");
  const [fill] = useState(() => new Animated.Value(progress));

  useEffect(() => {
    if (theme.reducedMotion) {
      fill.setValue(progress);
      return undefined;
    }
    const grow = Animated.timing(fill, {
      toValue: progress,
      duration: GROW_MS,
      easing: easing.outQuint,
      useNativeDriver: false,
    });
    grow.start();
    return () => grow.stop();
  }, [fill, progress, theme.reducedMotion]);

  const width = fill.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });

  return (
    <View style={styles.stages} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {stages.map((state, position) => {
        const bar = [styles.stage, { width: wide ? 44 : 24 }];
        if (state === "active") {
          return (
            <View key={stageNames[position]} style={[bar, { backgroundColor: theme.color("overlay-ink-8") }]}>
              <Animated.View
                style={[styles.stageFill, { width, backgroundColor: theme.color("status-live") }]}
              />
            </View>
          );
        }
        return <View key={stageNames[position]} style={[bar, { backgroundColor: theme.color(stageFill[state]) }]} />;
      })}
    </View>
  );
}

/**
 * Figma `Source row` (Knowledge base): a flat row with a four-stage pipeline (parse, chunk, embed, index).
 *
 * The four stage bars (24pt, 44pt from 640pt up) show the pipeline; the `active`
 * bar fills to `progress` over 400ms, or jumps under Reduce Motion. The trailing
 * slot is state-specific: a check labelled "Ready", a live percentage while
 * indexing, and a Retry button when failed, where the detail line turns danger red
 * with a warning icon. The `list` variant draws its divider as a real 1pt view on
 * the row's bottom edge; a stacked list therefore ends with that hairline too,
 * because React Native cannot match `:last-child`.
 *
 * @example
 * ```tsx
 * import { FilePdf } from "phosphor-react-native";
 * import { SourceRow } from "@horon-ai/expo";
 *
 * function IndexingSource() {
 *   return (
 *     <SourceRow
 *       status="indexing"
 *       icon={<FilePdf />}
 *       name="Q4 launch brief.pdf"
 *       detail="42 pages · embedding"
 *       progress={68}
 *     />
 *   );
 * }
 * ```
 */
export function SourceRow({
  status,
  icon,
  name,
  detail,
  progress = 0,
  onRetry,
  variant = "card",
  stages = defaultStages[status],
}: SourceRowProps) {
  const theme = useHoronTheme();
  const tileIcon = useMemo(() => ({ size: 16, color: theme.color("text-primary") }), [theme]);
  return (
    <View
      style={[
        styles.row,
        variant === "list"
          ? styles.rowList
          : [styles.rowCard, { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") }],
      ]}
    >
      {variant === "list" && (
        <View style={[styles.divider, { backgroundColor: theme.color("overlay-ink-8") }]} />
      )}
      <View style={[styles.tile, { backgroundColor: theme.color("overlay-ink-5") }]}>
        <IconContext.Provider value={tileIcon}>{icon}</IconContext.Provider>
      </View>
      <View style={styles.text}>
        {isPlainText(name) ? (
          <HoronText variant="label-md" numberOfLines={1}>
            {name}
          </HoronText>
        ) : (
          name
        )}
        <View style={styles.detail}>
          {status === "failed" && <WarningCircle size={12} color={theme.color("text-danger")} />}
          {isPlainText(detail) ? (
            <HoronText
              variant="caption"
              tone={status === "failed" ? "text-danger" : "text-secondary"}
              numberOfLines={1}
              style={styles.detailText}
            >
              {detail}
            </HoronText>
          ) : (
            detail
          )}
        </View>
      </View>
      <StageBars stages={stages} progress={progress} />
      <View style={styles.trailing}>
        {status === "ready" && (
          <View accessible accessibilityLabel="Ready">
            <Check size={16} color={theme.color("text-secondary")} />
          </View>
        )}
        {status === "indexing" && (
          <HoronText variant="label-md" tone="text-secondary" style={styles.percent}>
            {progress}%
          </HoronText>
        )}
        {status === "failed" && (
          <HoronPressable
            pressScale
            role="button"
            onPress={onRetry}
            hitSlop={touchSlop(theme.touch, theme.touch ? TOUCH_TARGET : 30)}
            style={({ pressed }) => [
              styles.retry,
              theme.touch && { height: TOUCH_TARGET },
              { backgroundColor: theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6") },
            ]}
          >
            <HoronText variant="label-sm">Retry</HoronText>
          </HoronPressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing["3"],
    rowGap: spacing["2"],
    paddingVertical: spacing["3"],
  },
  rowCard: {
    borderWidth: 1,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    paddingHorizontal: spacing["3"],
  },
  rowList: { paddingHorizontal: spacing["2"] },
  divider: { position: "absolute", left: spacing["2"], right: spacing["2"], bottom: 0, height: 1 },
  tile: {
    width: 32,
    height: 32,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderCurve: "continuous",
  },
  text: { flex: 1, minWidth: 0, gap: 2 },
  detail: { flexDirection: "row", alignItems: "center", gap: spacing["1"] },
  detailText: { flexShrink: 1 },
  stages: { flexShrink: 0, flexDirection: "row", alignItems: "center", gap: spacing["1"] },
  stage: { height: 3, overflow: "hidden", borderRadius: radius.full },
  stageFill: { height: "100%", borderRadius: radius.full },
  trailing: { width: 72, height: 30, flexShrink: 0, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" },
  percent: { width: 36, textAlign: "right", fontVariant: ["tabular-nums"] },
  retry: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    paddingHorizontal: spacing["3"],
  },
});
