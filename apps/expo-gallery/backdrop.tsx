import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useHoronTheme } from "@horon-ai/expo";

/**
 * A sky gradient from the accent ramp, so glass demos have something to
 * refract. Glass over a flat fill reads as a flat fill.
 */
export function Backdrop({ children }: { children: ReactNode }) {
  const theme = useHoronTheme();
  return (
    <View
      style={[
        styles.root,
        {
          backgroundImage: `linear-gradient(160deg, ${theme.color("status-live")} 0%, ${theme.color("bg-brand")} 55%, ${theme.color("text-brand")} 100%)`,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { borderRadius: 20, padding: 20, gap: 12, overflow: "hidden", borderCurve: "continuous" },
});
