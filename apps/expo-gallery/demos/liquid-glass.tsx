import { StyleSheet, View } from "react-native";
import { radius, spacing } from "@horon-ai/tokens";
import { GlassSurface, HoronText, LiquidGlass, useHoronTheme } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

/** The three tiers as a LiquidGlass layer, then the veil overlay material, all over the sky backdrop. */
export default function LiquidGlassDemo() {
  const theme = useHoronTheme();
  return (
    <View style={styles.stack}>
      <HoronText tone="text-secondary">
        {theme.glass === "native"
          ? "Native Liquid Glass (expo-glass-effect GlassView)."
          : "Frost fallback: glass-fill-frost with the token rim."}
      </HoronText>
      <Backdrop>
        {(["clear", "regular", "thick"] as const).map((tier) => (
          <View key={tier} style={styles.host}>
            <LiquidGlass tier={tier} />
            <HoronText variant="label-lg">{tier}</HoronText>
          </View>
        ))}
        <GlassSurface material="veil" radius={radius.md} style={styles.veil}>
          <HoronText variant="label-lg">veil</HoronText>
          <HoronText variant="body-sm" tone="text-secondary">
            Menus, popups and dialogs.
          </HoronText>
        </GlassSurface>
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing["3"] },
  host: { borderRadius: radius.xl, overflow: "hidden", padding: spacing["4"] },
  veil: { padding: spacing["4"], gap: spacing["1"] },
});
