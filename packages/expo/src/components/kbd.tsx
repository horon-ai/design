import { useMemo, type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { IconContext } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { usePlatform } from "../hooks/use-platform";
import { formatShortcut } from "../lib/platform";
import type { ControlSize } from "../lib/size";
import { HoronText } from "../lib/text";

/** Height rung of the chip, shared with the other sized controls: `sm`, `md`, `lg`. */
export type KbdSize = ControlSize;

/** Props of {@link Kbd}: the chip size, the shortcut string and the chip's own layout. */
export type KbdProps = {
  /** Chip size: `sm` 16pt caption, `md` the 20pt command-palette chip (default), `lg` 24pt label-sm. @default "md" */
  size?: KbdSize;
  /**
   * Shortcut such as `Mod+Enter`, drawn with the OS's key labels (`⌘↵` /
   * `Ctrl+Enter`) instead of `children`.
   */
  keys?: string;
  /** Outer layout, merged onto the chip. */
  style?: StyleProp<ViewStyle>;
  /** The keys to draw when `keys` is not passed, such as `⌘` or a bare glyph. */
  children?: ReactNode;
};

type Rung = { height: number; gap: number; padding: number; text: "caption" | "label-sm"; icon: number };

/** Chip rungs: 16/20/24pt high, so the three sizes read apart instead of only wider padding. */
const RUNGS: Record<KbdSize, Rung> = {
  sm: { height: 16, gap: spacing["0.5"], padding: spacing["1"], text: "caption", icon: 10 },
  md: { height: 20, gap: spacing["1"], padding: spacing["1.5"], text: "caption", icon: 12 },
  lg: { height: 24, gap: spacing["1"], padding: spacing["2"], text: "label-sm", icon: 14 },
};

/**
 * Figma `Kbd` (Command palette 110:676): a 6% ink chip with caption text.
 *
 * A chip for a keyboard shortcut: a small radius, secondary text, centred on a
 * line box the height of the chip so the glyph sits optically centred. Pass
 * `keys` as a `+`-joined shortcut such as `Mod+Enter` and the chip draws the
 * OS's labels — `⌘↵` on iOS and macOS, `Ctrl+Enter` on Android — through
 * `formatShortcut`. Without `keys` it renders `children`, so several chips can
 * be composed by hand. Any Phosphor icon inside is resized with the chip
 * (10/12/14pt).
 *
 * @example
 * ```tsx
 * import { Kbd } from "@horon-ai/expo";
 *
 * function Hint() {
 *   return <Kbd keys="Mod+K" />;
 * }
 * ```
 */
export function Kbd({ size = "md", keys, style, children }: KbdProps) {
  const theme = useHoronTheme();
  const { os } = usePlatform();
  const rung = RUNGS[size];
  const ink = theme.color("text-secondary");
  const iconContext = useMemo(() => ({ color: ink, size: rung.icon, weight: "regular" as const }), [ink, rung.icon]);
  return (
    <View
      style={[
        styles.root,
        {
          height: rung.height,
          gap: rung.gap,
          paddingHorizontal: rung.padding,
          backgroundColor: theme.color("overlay-ink-6"),
        },
        style,
      ]}
    >
      <IconContext.Provider value={iconContext}>
        <HoronText variant={rung.text} tone="text-secondary" numberOfLines={1} style={{ lineHeight: rung.height }}>
          {keys === undefined ? children : formatShortcut(keys, os)}
        </HoronText>
      </IconContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: "flex-start",
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.xs,
    borderCurve: "continuous",
  },
});
