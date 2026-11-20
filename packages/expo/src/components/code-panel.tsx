import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { HoronText } from "../lib/text";

/** Props for {@link CodePanel}: the panel surface plus the code it shows. */
export type CodePanelProps = {
  /** The code, usually a string; line breaks are kept as written. */
  children?: ReactNode;
  /** Layout merged onto the panel (width, margins). */
  style?: StyleProp<ViewStyle>;
};

/**
 * Paper `Code block` (1VV9-0), the light variant: a 10px-radius neutral-50 panel with a 1px hairline,
 * mono text on a 21px line pitch, no header bar or copy button. Wrap keys in `CodeKey`; plain text
 * reads as the string colour.
 *
 * React's `<pre>` scrolled horizontally instead of wrapping, and the dark theme swapped the panel to
 * neutral-800 with a stronger border. A horizontal `ScrollView` keeps that line behaviour on a phone,
 * and the scheme is read from the theme, so no media query is involved.
 *
 * @example
 * ```tsx
 * <CodePanel>{"---\ntitle: Weekly digest\n---"}</CodePanel>
 * ```
 */
export function CodePanel({ children, style }: CodePanelProps) {
  const theme = useHoronTheme();
  const dark = theme.scheme === "dark";

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: dark ? primitives["neutral-800"] : primitives["neutral-50"],
          borderColor: theme.color(dark ? "border-strong" : "border-default"),
        },
        style,
      ]}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <HoronText variant="code" tone="syntax-string">
          {children}
        </HoronText>
      </ScrollView>
    </View>
  );
}

/**
 * A frontmatter key or other highlighted token inside a `CodePanel`.
 *
 * Part of {@link CodePanel}. It changes only the colour of the text it wraps, so it nests inside
 * the panel's text: `{"title: "}<CodeKey>{"draft"}</CodeKey>`.
 */
export function CodeKey({ children, style }: { children?: ReactNode; style?: StyleProp<TextStyle> }) {
  return (
    <HoronText variant="code" tone="syntax-key" style={style}>
      {children}
    </HoronText>
  );
}

const styles = StyleSheet.create({
  root: {
    maxWidth: "100%",
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: radius.md,
    borderCurve: "continuous",
    paddingHorizontal: spacing["4"],
    paddingVertical: spacing["3.5"],
  },
  scroll: { flexGrow: 1 },
});
