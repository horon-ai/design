import { StyleSheet, View } from "react-native";
import { FlueBackground, HoronText } from "@horon-ai/expo";

/** The three variants on the sky and night palettes, plus a speed override and a tint. */
export default function FlueBackgroundDemo() {
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        default · the full-frame plume
      </HoronText>
      <Panel variant="default" caption="default" />
      <HoronText variant="label-sm" tone="text-secondary">
        sidebar · the narrow column under the sidebar glass
      </HoronText>
      <Panel variant="sidebar" caption="sidebar" narrow />
      <HoronText variant="label-sm" tone="text-secondary">
        auth · the whole screen behind a centred card
      </HoronText>
      <Panel variant="auth" caption="auth" />
      <HoronText variant="label-sm" tone="text-secondary">
        A speed override and a tint token
      </HoronText>
      <Panel variant="default" caption="config speed 0.8" config={{ speed: 0.8, glow: 0.7 }} />
      <Panel variant="default" caption="tint glass-thick" tintClassName="glass-thick" />
      <HoronText variant="caption" tone="text-secondary">
        The plumes rise and fall on their own; Reduce Motion holds them still.
      </HoronText>
    </View>
  );
}

/** One framed surface with the gradient behind a readable label, so the smoke has content over it. */
function Panel({
  variant,
  caption,
  narrow,
  config,
  tintClassName,
}: {
  variant: "default" | "sidebar" | "auth";
  caption: string;
  narrow?: boolean;
  config?: { speed?: number; glow?: number };
  tintClassName?: string;
}) {
  return (
    <View style={[styles.panel, narrow && styles.narrow]}>
      <FlueBackground variant={variant} config={config} tintClassName={tintClassName} />
      <View style={styles.content}>
        <HoronText variant="label-lg" tone="text-primary">
          {caption}
        </HoronText>
        <HoronText variant="body-sm" tone="text-secondary">
          The token-coloured plumes rise behind this line, so the smoke reads as a column rather than a flat fill.
        </HoronText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  panel: { position: "relative", overflow: "hidden", borderRadius: 16, minHeight: 260, borderCurve: "continuous" },
  narrow: { width: 240 },
  content: { padding: 24, gap: 6 },
});
