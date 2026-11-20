import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Animated,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { CaretDown, Play } from "phosphor-react-native";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { useDevice } from "../hooks/use-device";
import { usePlatform } from "../hooks/use-platform";
import { duration, easing } from "../lib/motion";
import { formatShortcut } from "../lib/platform";
import { HoronPressable } from "../lib/press";
import { TOUCH_TARGET } from "../lib/size";
import { HoronText } from "../lib/text";
import { useHoronTheme, type ColorToken } from "../provider";

/** Props for {@link PanelPillTabs}: the tab items, the controlled or default selection and the change handler. */
export type PanelPillTabsProps = {
  /** Tabs in display order; the first one is the default selection. */
  items: {
    /** Value handed to `onValueChange` and compared against `value`. */
    value: string;
    /** Tab label. */
    label: ReactNode;
  }[];
  /** Controlled selected value; omit it to let the track keep its own selection. */
  value?: string;
  /** Selection used before the first press, falling back to the first item. */
  defaultValue?: string;
  /** Fires with the next value on press. */
  onValueChange?: (value: string) => void;
  /** Accessible name of the tab list. */
  "aria-label"?: string;
  /** Outer layout of the track, for width overrides. */
  style?: StyleProp<ViewStyle>;
};

/** Height of a pill, `h-7.5`. */
const PILL = 30;
/** The track's inner padding, `p-[3px]`. */
const RIM = 3;
/** Length of the sliding selection, `motion-indicator`. */
const SLIDE = 280;
/** Leading punctuation that hugs the item before it instead of opening the 4pt gap. */
const PUNCTUATION = /^[,.;:!?%)\]]/;

/** True when a node is plain text, which React Native can only draw inside its own `Text`. */
function isText(value: ReactNode): boolean {
  return typeof value === "string" || typeof value === "number";
}

/**
 * Multiplies the alpha of a token colour, the `/40` opacity modifier of a
 * Tailwind ring. The value comes from `@horon-ai/tokens`, never from a literal.
 */
function fade(color: string, factor: number): string {
  const hex = color.replace("#", "");
  const alpha = hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) : 255;
  const next = Math.round(alpha * factor)
    .toString(16)
    .padStart(2, "0");
  return `#${hex.slice(0, 6)}${next}`;
}

/** Box of one tab inside the track, in points, as `onLayout` reports it. */
type TabBox = { x: number; width: number };

/**
 * The 5% ink pill track shared by the Bot panels (Paper `YNQ-1`): 3pt padding,
 * 2pt gap, 30pt options with 12pt inset and a 10% ink selection that slides
 * between options in 280ms.
 *
 * Works controlled (`value`) or uncontrolled (`defaultValue`); each option is a
 * `tab` that announces its `selected` state, and the track is a `tablist` named
 * by `aria-label`. Under Reduce Motion the selection jumps to its new option
 * instead of sliding.
 *
 * @example
 * ```tsx
 * <PanelPillTabs
 *   aria-label="Instructions view"
 *   items={[
 *     { value: "instructions", label: "Instructions" },
 *     { value: "example", label: "Example" },
 *   ]}
 * />
 * ```
 */
export function PanelPillTabs({
  items,
  value,
  defaultValue,
  onValueChange,
  "aria-label": ariaLabel,
  style,
}: PanelPillTabsProps) {
  const theme = useHoronTheme();
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value ?? "");
  const selected = value ?? inner;
  const height = theme.touch ? TOUCH_TARGET : PILL;
  const reducedMotion = theme.reducedMotion;

  const [left] = useState(() => new Animated.Value(0));
  const [width] = useState(() => new Animated.Value(0));
  const [boxes, setBoxes] = useState<Record<string, TabBox>>({});
  const placed = useRef(false);

  // The first placement lands in place; every later move slides, unless motion is off.
  useEffect(() => {
    const box = boxes[selected];
    if (!box) return undefined;
    if (!placed.current || reducedMotion) {
      placed.current = true;
      left.setValue(box.x);
      width.setValue(box.width);
      return undefined;
    }
    const animation = Animated.parallel([
      Animated.timing(left, { toValue: box.x, duration: SLIDE, easing: easing.emphasized, useNativeDriver: false }),
      Animated.timing(width, {
        toValue: box.width,
        duration: SLIDE,
        easing: easing.emphasized,
        useNativeDriver: false,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [boxes, selected, reducedMotion, left, width]);

  const measure = (key: string) => (event: LayoutChangeEvent) => {
    const { x, width: itemWidth } = event.nativeEvent.layout;
    setBoxes((previous) => {
      const current = previous[key];
      if (current && current.x === x && current.width === itemWidth) return previous;
      return { ...previous, [key]: { x, width: itemWidth } };
    });
  };

  const select = (next: string) => {
    setInner(next);
    onValueChange?.(next);
  };

  return (
    <View role="tablist" aria-label={ariaLabel} style={[styles.track, style]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.indicator, { backgroundColor: theme.color("overlay-ink-10"), left, width }]}
      />
      {items.map((item) => {
        const active = item.value === selected;
        return (
          <HoronPressable
            key={item.value}
            role="tab"
            haptic="selection"
            accessibilityState={{ selected: active }}
            onLayout={measure(item.value)}
            onPress={() => select(item.value)}
            style={[styles.tab, { height }]}
          >
            {({ pressed }) => (
              <View style={styles.tabInner}>
                {isText(item.label) ? (
                  <HoronText
                    variant="label-md"
                    tone={active || pressed ? "text-primary" : "text-secondary"}
                    numberOfLines={1}
                  >
                    {item.label}
                  </HoronText>
                ) : (
                  item.label
                )}
              </View>
            )}
          </HoronPressable>
        );
      })}
    </View>
  );
}

/** Chip tint: `sky` the default light blue, `brand` the deeper sky-700, `neutral` grey. */
export type InstructionVariableTone = "sky" | "brand" | "neutral";

/** Fill and ring of a variable chip, as the token pair react draws with `ring-*\/40`. */
const chipPaint: Record<InstructionVariableTone, { fill: ColorToken; ring: ColorToken }> = {
  sky: { fill: "accent-sky-500-18", ring: "accent-sky-500-90" },
  brand: { fill: "accent-sky-700-18", ring: "accent-sky-700-90" },
  neutral: { fill: "text-placeholder-18", ring: "text-placeholder-90" },
};

/** Fill of the 6pt dot that marks a variable in the test-value list. */
const dotPaint: Record<InstructionVariableTone, string> = {
  sky: primitives["sky-500"],
  brand: primitives["sky-700"],
  neutral: primitives["neutral-500"],
};

/** One piece of an instruction line: plain text, or a `{{variable}}` chip. */
export type InstructionPart =
  | string
  | {
      /** Variable name, rendered inside the chip without the braces. */
      variable: string;
      /** Chip tint. @default "sky" */
      tone?: InstructionVariableTone;
    };

/** A test value for one `{{variable}}` in the prompt, shown under the instructions. */
export type InstructionVariable = {
  /** Variable name shown above the test value. */
  name: string;
  /** Dot tint matching the chip in the prompt. @default "sky" */
  tone?: InstructionVariableTone;
  /** Test value used when the instruction is run. */
  value: string;
};

/** Props for {@link BotInstructionsPanel}: the bot, the prompt lines, the optional example, variables and scenarios, and the run handler. */
export type BotInstructionsPanelProps = ViewProps & {
  /** Panel heading. @default "Instructions" */
  title?: ReactNode;
  /** Version label in the header pill, for example `v4`. */
  version?: string;
  /** Status next to the version, rendered with a live dot. */
  versionStatus?: string;
  /** Bot whose prompt is shown; the initial fills the 18pt tile. */
  bot: {
    /** One-character tile label. */
    initial: string;
    /** Bot name next to the tile. */
    name: string;
  };
  /** The prompt text, one array of parts per line, rendered read-only. */
  instructions: InstructionPart[][];
  /** Shown under the Example tab instead of the prompt. */
  example?: ReactNode;
  /** Prompt length shown at the right of the tab row; hidden when undefined. */
  tokenCount?: number;
  /** Test values for each variable in the prompt. */
  variables?: InstructionVariable[];
  /** Test scenarios offered as pills under the prompt. */
  scenarios?: string[];
  /** Scenario selected on first render, falling back to the first scenario. */
  defaultScenario?: string;
  /** Fires with the selected scenario (or undefined) when Run is pressed; the panel does not run anything itself. */
  onRun?: (scenario: string | undefined) => void;
  /** The last run's output, or a hint until there is one. */
  output?: ReactNode;
  /** Makes the version pill actionable; without it the pill is a plain label. */
  onVersionClick?: () => void;
  /** Makes the bot pill actionable; without it the pill is a plain label. */
  onBotClick?: () => void;
};

/** Inline rounded chip that stands in for a `{{variable}}` inside a prompt line. */
function VariableChip({ tone = "sky", children }: { tone?: InstructionVariableTone; children: ReactNode }) {
  const theme = useHoronTheme();
  const paint = chipPaint[tone];
  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: theme.color(paint.fill), borderColor: fade(theme.color(paint.ring), 0.4) },
      ]}
    >
      <HoronText variant="body-sm">{children}</HoronText>
    </View>
  );
}

/** Hairline between the panel's regions. */
function Divider() {
  const theme = useHoronTheme();
  return <View role="separator" style={[styles.divider, { backgroundColor: theme.color("overlay-ink-8") }]} />;
}

/**
 * The live-status dot: a 6pt disc with a halo that expands to 6pt and fades,
 * `animate-live-pulse`, which stays still under Reduce Motion.
 */
function LiveDot() {
  const theme = useHoronTheme();
  const [halo] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (theme.reducedMotion) {
      halo.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.timing(halo, {
        toValue: 1,
        duration: duration.livePulse,
        easing: easing.outQuint,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [halo, theme.reducedMotion]);

  return (
    <View style={styles.dot}>
      <Animated.View
        style={[
          styles.dotHalo,
          {
            backgroundColor: theme.color("status-live"),
            opacity: halo.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }),
            transform: [{ scale: halo.interpolate({ inputRange: [0, 1], outputRange: [1, 2] }) }],
          },
        ]}
      />
      <View style={[styles.dotCore, { backgroundColor: theme.color("status-live") }]} />
    </View>
  );
}

/** Fades its children in while lifting them 4pt, `motion-rise`; under Reduce Motion they land at once. */
function Rise({ style, children }: { style?: StyleProp<ViewStyle>; children: ReactNode }) {
  const theme = useHoronTheme();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (theme.reducedMotion) {
      progress.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: duration.tabPanel,
      easing: easing.outQuint,
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
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** The `Mod+Enter` chip of the Run button, tinted for the inverse fill it sits on. */
function ShortcutChip({ label }: { label: string }) {
  const theme = useHoronTheme();
  return (
    <View style={[styles.shortcut, { backgroundColor: theme.color("bg-surface-6") }]}>
      <HoronText variant="caption" tone="text-inverse" style={styles.shortcutLabel}>
        {label}
      </HoronText>
    </View>
  );
}

/**
 * Bot instructions panel (Paper `YN3-1` / `GOZ-0`): a 20pt-radius surface with
 * the bot header, an Instructions / Example tab pair over the prompt text with
 * `{{variable}}` chips, and a test-run block.
 *
 * The tab and the selected scenario are local state; the panel only reports a
 * run through `onRun`. Output is re-keyed per run so it rises in every time. The
 * Run button carries a `Mod+Enter` chip — ⌘↵ on macOS and iOS, Ctrl+Enter
 * elsewhere — which a touch screen never shows. React Native has no keyboard
 * focus, so the prompt's focus caret is not drawn.
 *
 * @example
 * ```tsx
 * <BotInstructionsPanel
 *   version="v4"
 *   bot={{ initial: "R", name: "Researcher" }}
 *   instructions={[["Summarise ", { variable: "sheet" }, " for the team."]]}
 *   variables={[{ name: "sheet", value: "Q3 metrics" }]}
 *   scenarios={["Weekly digest", "Board update"]}
 *   onRun={(scenario) => run(scenario)}
 * />
 * ```
 */
export function BotInstructionsPanel({
  title = "Instructions",
  version,
  versionStatus,
  bot,
  instructions,
  example,
  tokenCount,
  variables,
  scenarios,
  defaultScenario,
  onRun,
  output,
  onVersionClick,
  onBotClick,
  style,
  ...props
}: BotInstructionsPanelProps) {
  const theme = useHoronTheme();
  const [tab, setTab] = useState("instructions");
  const [scenario, setScenario] = useState(defaultScenario ?? scenarios?.[0]);
  const [runCount, setRunCount] = useState(0);
  const { keyboardHints } = useDevice();
  const { os } = usePlatform();
  const chrome = theme.touch ? TOUCH_TARGET : PILL;

  const versionPill = (
    <View style={styles.pillContent}>
      <HoronText variant="label-sm">{version}</HoronText>
      {versionStatus ? (
        <>
          <LiveDot />
          <HoronText variant="label-sm" tone="text-secondary">
            {versionStatus}
          </HoronText>
        </>
      ) : null}
      {onVersionClick ? <CaretDown size={12} color={theme.color("text-secondary")} /> : null}
    </View>
  );
  const botPillContent = (
    <View style={styles.pillContent}>
      <View style={[styles.botTile, { backgroundColor: theme.color("interactive-primary") }]}>
        <HoronText variant="label-sm" tone="text-inverse">
          {bot.initial}
        </HoronText>
      </View>
      <HoronText variant="label-sm" numberOfLines={1} style={styles.botName}>
        {bot.name}
      </HoronText>
      {onBotClick ? <CaretDown size={12} color={theme.color("text-secondary")} /> : null}
    </View>
  );

  return (
    <View
      style={[
        styles.root,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
        style,
      ]}
      {...props}
    >
      <View style={styles.header}>
        {isText(title) ? (
          <HoronText variant="label-lg" style={styles.title}>
            {title}
          </HoronText>
        ) : (
          title
        )}
        {version ? (
          onVersionClick ? (
            <HoronPressable
              role="button"
              pressScale
              onPress={onVersionClick}
              style={({ pressed }) => [
                styles.pill,
                { height: chrome, backgroundColor: theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6") },
              ]}
            >
              {versionPill}
            </HoronPressable>
          ) : (
            <View style={[styles.pill, { height: PILL, backgroundColor: theme.color("overlay-ink-6") }]}>
              {versionPill}
            </View>
          )
        ) : null}
        <View style={styles.spacer} />
        {onBotClick ? (
          <HoronPressable
            role="button"
            pressScale
            onPress={onBotClick}
            style={({ pressed }) => [
              styles.pill,
              styles.botPill,
              { height: chrome, backgroundColor: theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6") },
            ]}
          >
            {botPillContent}
          </HoronPressable>
        ) : (
          <View style={[styles.pill, styles.botPill, { height: PILL, backgroundColor: theme.color("overlay-ink-6") }]}>
            {botPillContent}
          </View>
        )}
      </View>
      <Divider />
      <View style={styles.prompt}>
        <View style={styles.tabRow}>
          <PanelPillTabs
            aria-label="Instructions view"
            value={tab}
            onValueChange={setTab}
            items={[
              { value: "instructions", label: "Instructions" },
              { value: "example", label: "Example" },
            ]}
          />
          <View style={styles.spacer} />
          {tokenCount === undefined ? null : (
            <HoronText variant="caption" tone="text-secondary">
              {tokenCount} tokens
            </HoronText>
          )}
        </View>
        <Rise key={tab} style={styles.lineBlock}>
          {tab === "example" && example !== undefined ? (
            isText(example) ? (
              <HoronText variant="body-sm">{example}</HoronText>
            ) : (
              example
            )
          ) : (
            instructions.map((line) => (
              <View key={line.map((part) => (typeof part === "string" ? part : part.variable)).join("|")} style={styles.line}>
                {line.map((part) =>
                  typeof part === "string" ? (
                    <HoronText
                      key={part}
                      variant="body-sm"
                      style={PUNCTUATION.test(part) ? styles.punctuation : undefined}
                    >
                      {part}
                    </HoronText>
                  ) : (
                    <VariableChip key={part.variable} tone={part.tone}>
                      {part.variable}
                    </VariableChip>
                  ),
                )}
              </View>
            ))
          )}
        </Rise>
        <View style={styles.hint}>
          <HoronText variant="caption" tone="text-secondary">
            Type
          </HoronText>
          <View style={[styles.hintChip, { backgroundColor: theme.color("overlay-ink-6") }]}>
            <HoronText variant="caption" tone="text-secondary">
              {"{{"}
            </HoronText>
          </View>
          <HoronText variant="caption" tone="text-secondary">
            to add a variable
          </HoronText>
        </View>
      </View>
      {variables || scenarios ? (
        <>
          <Divider />
          <View style={styles.tests}>
            {variables ? (
              <View style={styles.variables}>
                {variables.map((variable) => (
                  <View key={variable.name} style={styles.variable}>
                    <View style={styles.variableLabel}>
                      <View style={[styles.variableDot, { backgroundColor: dotPaint[variable.tone ?? "sky"] }]} />
                      <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
                        {variable.name}
                      </HoronText>
                    </View>
                    <View style={[styles.variableValue, { backgroundColor: theme.color("overlay-ink-5") }]}>
                      <HoronText variant="body-sm" numberOfLines={1}>
                        {variable.value}
                      </HoronText>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
            <View style={styles.scenarioRow}>
              {scenarios ? (
                <PanelPillTabs
                  aria-label="Scenario"
                  value={scenario}
                  onValueChange={setScenario}
                  items={scenarios.map((name) => ({ value: name, label: name }))}
                />
              ) : null}
              <View style={styles.spacer} />
              <HoronPressable
                role="button"
                pressScale
                onPress={() => {
                  setRunCount((count) => count + 1);
                  onRun?.(scenario);
                }}
                style={({ pressed }) => [
                  styles.run,
                  {
                    height: chrome,
                    backgroundColor: theme.color(pressed ? "interactive-primary-hover" : "interactive-primary"),
                  },
                ]}
              >
                <Play size={14} color={theme.color("text-inverse")} />
                <HoronText variant="label-sm" tone="text-inverse">
                  Run
                </HoronText>
                {keyboardHints ? <ShortcutChip label={formatShortcut("Mod+Enter", os)} /> : null}
              </HoronPressable>
            </View>
          </View>
        </>
      ) : null}
      {output === undefined ? null : (
        <Rise key={runCount} style={[styles.output, { backgroundColor: theme.color("overlay-ink-3") }]}>
          {isText(output) ? (
            <HoronText variant="body-sm" tone="text-secondary">
              {output}
            </HoronText>
          ) : (
            output
          )}
        </Rise>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    maxWidth: 620,
    borderWidth: 1,
    borderRadius: radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing["2"],
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["4"],
    paddingBottom: spacing["3.5"],
  },
  title: { flexShrink: 1 },
  spacer: { flexGrow: 1, flexShrink: 1, minWidth: 0 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    borderRadius: radius.full,
    paddingHorizontal: spacing["2.5"],
  },
  botPill: { paddingLeft: spacing["1.5"] },
  pillContent: { flexDirection: "row", alignItems: "center", gap: spacing["1.5"] },
  botTile: {
    width: 18,
    height: 18,
    borderRadius: radius.xs,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  botName: { flexShrink: 1 },
  divider: { height: 1, alignSelf: "stretch" },
  prompt: {
    flexDirection: "column",
    gap: spacing["1"],
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["3"],
    paddingBottom: spacing["3.5"],
  },
  tabRow: { flexDirection: "row", alignItems: "center", gap: spacing["2"], paddingBottom: spacing["2"] },
  lineBlock: { flexDirection: "column", gap: spacing["1"] },
  line: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["1"] },
  punctuation: { marginLeft: -spacing["1"] },
  hint: { flexDirection: "row", alignItems: "center", gap: spacing["1.5"], paddingTop: spacing["2"] },
  hintChip: {
    borderRadius: radius.md,
    borderCurve: "continuous",
    paddingHorizontal: spacing["1.5"],
    paddingVertical: 1,
  },
  chip: {
    borderRadius: radius.xs,
    borderCurve: "continuous",
    borderWidth: 1,
    paddingHorizontal: spacing["1.5"],
    paddingVertical: 1,
  },
  tests: {
    flexDirection: "column",
    gap: spacing["2.5"],
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["3"],
    paddingBottom: spacing["3.5"],
  },
  variables: { flexDirection: "row", flexWrap: "wrap", gap: spacing["2"] },
  variable: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 140,
    minWidth: 0,
    flexDirection: "column",
    gap: spacing["1.5"],
  },
  variableLabel: { flexDirection: "row", alignItems: "center", gap: spacing["1.5"] },
  variableDot: { width: 6, height: 6, borderRadius: radius.full },
  variableValue: {
    height: 40,
    minWidth: 0,
    borderRadius: radius.md,
    borderCurve: "continuous",
    paddingHorizontal: spacing["3"],
    justifyContent: "center",
  },
  scenarioRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["2"] },
  run: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing["1.5"],
    flexShrink: 0,
    borderRadius: radius.full,
    paddingLeft: spacing["3.5"],
    paddingRight: spacing["3"],
  },
  output: {
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["3.5"],
    paddingBottom: spacing["4"],
  },
  shortcut: {
    height: 20,
    borderRadius: radius.xs,
    borderCurve: "continuous",
    paddingHorizontal: spacing["1.5"],
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutLabel: { opacity: 0.8 },
  track: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["0.5"],
    alignSelf: "flex-start",
    maxWidth: "100%",
    padding: RIM,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  indicator: { position: "absolute", top: RIM, bottom: RIM, borderRadius: radius.full },
  tab: { borderRadius: radius.full, justifyContent: "center" },
  tabInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing["3"],
  },
  dot: { width: 6, height: 6, justifyContent: "center", alignItems: "center" },
  dotHalo: { position: "absolute", width: 6, height: 6, borderRadius: radius.full },
  dotCore: { width: 6, height: 6, borderRadius: radius.full },
});
