import { useEffect, useState, type ReactNode } from "react";
import {
  Animated,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { CaretDown } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { HoronPressable } from "../lib/press";
import { easing } from "../lib/motion";
import { GlassSurface } from "../lib/glass-surface";
import { DISABLED_OPACITY, TOUCH_TARGET, touchSlop } from "../lib/size";
import { HoronText } from "../lib/text";

/** Material of the chat controls: `solid` on raised surfaces, `glass` over imagery and glass panels. */
export type ChatControlSurface = "solid" | "glass";

/** Props of the two jump controls: the surface, the accessible name and the press handler. */
type ControlButtonProps = Omit<PressableProps, "children" | "style"> & {
  /**
   * `solid` (default) on raised surfaces, `glass` over imagery and glass panels.
   * @default "solid"
   */
  surface?: ChatControlSurface;

  /** Accessible name; the control has no visible text. */
  "aria-label"?: string;
  /** Outer layout, merged onto the control. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Figma `Jump to latest` (Chat controls 88:659): a 44pt clear-glass circle with a 20pt caret.
 *
 * Announces itself as a `button` named by `aria-label` (default `"Jump to latest"`),
 * paints the pressed fill of its solid surface, drops to 40% while disabled and
 * ignores presses then. `glass` is an `expo-glass-effect` `GlassView` on iOS 26+
 * and the token frost elsewhere, where the native material answers the touch
 * itself. The caller's `onPress` performs the scroll to the newest message.
 *
 * @example
 * ```tsx
 * <JumpToLatest surface="glass" onPress={() => scrollToLatest()} />
 * ```
 */
export function JumpToLatest({
  surface = "solid",
  "aria-label": ariaLabel = "Jump to latest",
  disabled,
  style,
  ...props
}: ControlButtonProps) {
  const theme = useHoronTheme();
  const caret = <CaretDown size={20} color={theme.color("text-primary")} />;
  return (
    <HoronPressable
      {...props}
      pressScale
      role="button"
      accessibilityLabel={ariaLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={touchSlop(theme.touch, TOUCH_TARGET)}
      style={[styles.jump, disabled && { opacity: DISABLED_OPACITY }, style]}
    >
      {({ pressed }) =>
        surface === "glass" ? (
          <GlassSurface
            tier="clear"
            radius={radius.full}
            interactive={!disabled}
            pressed={pressed}
            style={styles.jumpFace}
          >
            {caret}
          </GlassSurface>
        ) : (
          <View
            style={[
              styles.jumpFace,
              styles.border,
              {
                borderColor: theme.color("border-default"),
                backgroundColor: theme.color(pressed ? "interactive-secondary-hover" : "bg-surface"),
              },
            ]}
          >
            {caret}
          </View>
        )
      }
    </HoronPressable>
  );
}

/**
 * Figma `New messages` (88:659): a 40pt clear-glass pill with a 16pt caret and a label.
 *
 * A peer of {@link JumpToLatest} for the "there are unread messages above" case;
 * the child is the label, the pill grows to the 44pt touch height while touch is
 * on, and every press attribute is forwarded to the `Pressable`.
 *
 * @example
 * ```tsx
 * <NewMessagesPill onPress={() => scrollToLatest()}>3 new messages</NewMessagesPill>
 * ```
 */
export function NewMessagesPill({
  surface = "solid",
  disabled,
  style,
  children,
  ...props
}: Omit<ControlButtonProps, "aria-label"> & { children?: ReactNode }) {
  const theme = useHoronTheme();
  const face = [styles.pillFace, { paddingLeft: spacing["3.5"], paddingRight: spacing["4"], gap: spacing["1.5"] }];
  const height = theme.touch ? TOUCH_TARGET : 40;
  return (
    <HoronPressable
      {...props}
      pressScale
      role="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={touchSlop(theme.touch, height)}
      style={[styles.pill, { height }, disabled && { opacity: DISABLED_OPACITY }, style]}
    >
      {({ pressed }) =>
        surface === "glass" ? (
          <GlassSurface
            tier="clear"
            radius={radius.full}
            interactive={!disabled}
            pressed={pressed}
            style={face}
          >
            <CaretDown size={16} color={theme.color("text-primary")} />
            <HoronText variant="label-md" numberOfLines={1}>
              {children}
            </HoronText>
          </GlassSurface>
        ) : (
          <View
            style={[
              face,
              styles.border,
              {
                borderColor: theme.color("border-default"),
                backgroundColor: theme.color(pressed ? "interactive-secondary-hover" : "bg-surface"),
              },
            ]}
          >
            <CaretDown size={16} color={theme.color("text-primary")} />
            <HoronText variant="label-md" numberOfLines={1}>
              {children}
            </HoronText>
          </View>
        )
      }
    </HoronPressable>
  );
}

/** Bar heights of the Figma waveform, in points. */
const WAVEFORM = [8, 14, 22, 12, 26, 18, 10, 20, 28, 16, 9, 18, 24, 12, 7, 15, 21, 11];

/** Props of {@link VoiceInput}: the elapsed time, the levels, the surface and the stop handler. */
export type VoiceInputProps = {
  /** Elapsed time, such as "0:07". */
  elapsed: ReactNode;
  /** 0-1 levels for the 18 bars; defaults to the Figma waveform. Each level is scaled to 4–28pt. */
  levels?: number[];
  /**
   * Animates the waveform while true; set false once recording stops.
   * @default true
   */
  recording?: boolean;
  /** Fires when the red stop button is pressed. */
  onStop?: () => void;
  /**
   * Accessible label of the stop button.
   * @default "Stop recording"
   */
  stopLabel?: string;
  /**
   * `solid` (default) on raised surfaces, `glass` over imagery and glass panels.
   * @default "solid"
   */
  surface?: ChatControlSurface;

};

/** One bar of the {@link VoiceInput} waveform: its Figma height and its stable key. */
type WaveBar = { height: number; id: string };

/**
 * The waveform of {@link VoiceInput}: 18 bars at their token height, each scaling
 * on the 900ms `wave-level` loop with a 120ms stagger.
 *
 * The bar values are created once per mount and the component is re-mounted when
 * the bar count changes, so a caller passing a different `levels` array never
 * animates a bar that is no longer drawn. Reduce Motion keeps every bar at full
 * height. The whole strip is hidden from assistive technology by its parent.
 */
function Waveform({ bars, recording }: { bars: WaveBar[]; recording: boolean }) {
  const theme = useHoronTheme();
  const [scales] = useState(() => bars.map(() => new Animated.Value(1)));

  useEffect(() => {
    if (!recording || theme.reducedMotion) {
      for (const value of scales) {
        value.stopAnimation();
        value.setValue(1);
      }
      return undefined;
    }
    const timers = scales.map((value, position) =>
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: 0.35,
              duration: 450,
              easing: easing.inOut,
              useNativeDriver: true,
            }),
            Animated.timing(value, {
              toValue: 1,
              duration: 450,
              easing: easing.inOut,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      }, position * 120),
    );
    return () => {
      for (const timer of timers) clearTimeout(timer);
      for (const value of scales) value.stopAnimation();
    };
  }, [recording, theme.reducedMotion, scales]);

  return (
    <View style={styles.wave} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {bars.map((bar, position) => (
        <Animated.View
          key={bar.id}
          style={[
            styles.bar,
            {
              height: bar.height,
              backgroundColor: theme.color("interactive-primary-75"),
              transform: [{ scaleY: scales[position] }],
            },
          ]}
        />
      ))}
    </View>
  );
}

/**
 * Figma `Voice input` (88:659): a 52pt pill with a red stop button, waveform and timer.
 *
 * The 18 bars keep the Figma heights unless `levels` is passed, in which case each
 * 0-1 level maps to a 4–28pt bar. With `recording` the bars run the 900ms
 * `wave-level` loop (scaleY 1 → 0.35 → 1) on a 120ms stagger; Reduce Motion parks
 * them at full height. The waveform is hidden from assistive technology, so only
 * the stop button and the elapsed text reach it. The stop button grows to 44pt
 * while touch is on.
 *
 * @example
 * ```tsx
 * <VoiceInput elapsed="0:07" recording onStop={() => stopRecording()} />
 * ```
 */
export function VoiceInput({
  elapsed,
  levels,
  recording = true,
  onStop,
  stopLabel = "Stop recording",
  surface = "solid",
}: VoiceInputProps) {
  const theme = useHoronTheme();
  const heights = levels ? levels.map((level) => Math.max(4, Math.round(level * 28))) : WAVEFORM;
  const bars = heights.map((height, position) => ({ height, id: `wave-${position}` }));
  const stop = theme.touch ? TOUCH_TARGET : 36;

  const body = (
    <>
      <HoronPressable
        pressScale
        role="button"
        accessibilityLabel={stopLabel}
        onPress={onStop}
        hitSlop={touchSlop(theme.touch, stop)}
        style={({ pressed }) => [
          styles.stop,
          {
            width: stop,
            height: stop,
            backgroundColor: theme.color(pressed ? "interactive-danger-hover" : "interactive-danger"),
          },
        ]}
      >
        <View style={[styles.stopMark, { backgroundColor: theme.color("interactive-on-danger") }]} />
      </HoronPressable>
      <Waveform key={bars.length} bars={bars} recording={recording} />
      <HoronText variant="label-md" tone="text-secondary" style={styles.elapsed}>
        {elapsed}
      </HoronText>
    </>
  );

  const frame = [styles.voice, { gap: spacing["3"], paddingHorizontal: spacing["2"] }];
  if (surface === "glass") {
    return (
      <GlassSurface tier="regular" radius={radius.full} style={frame}>
        {body}
      </GlassSurface>
    );
  }
  return (
    <View
      style={[
        ...frame,
        styles.border,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
      ]}
    >
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  jump: { width: TOUCH_TARGET, height: TOUCH_TARGET, flexShrink: 0 },
  jumpFace: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
    borderRadius: radius.full,
  },
  border: { borderWidth: 1 },
  pill: { alignSelf: "flex-start", flexShrink: 0, borderRadius: radius.full, borderCurve: "continuous" },
  pillFace: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    borderCurve: "continuous",
    borderRadius: radius.full,
  },
  voice: {
    height: 52,
    width: 240,
    maxWidth: "100%",
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    borderCurve: "continuous",
  },
  stop: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  stopMark: { width: spacing["3"], height: spacing["3"], borderRadius: 3 },
  wave: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    overflow: "hidden",
  },
  bar: { width: 3, flexShrink: 0, borderRadius: 2 },
  elapsed: { width: 40, flexShrink: 0, textAlign: "right", fontVariant: ["tabular-nums"] },
});
