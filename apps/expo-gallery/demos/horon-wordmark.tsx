import { StyleSheet, View } from "react-native";
import { HoronText, HoronWordmark, useHoronTheme } from "@horon-ai/expo";

export default function HoronWordmarkDemo() {
  const theme = useHoronTheme();

  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Heights 11.5, 16 and 24 · the width follows the drawing
      </HoronText>
      <View style={styles.column}>
        <HoronWordmark />
        <HoronWordmark height={16} />
        <HoronWordmark height={24} />
      </View>
      <HoronText variant="label-sm" tone="text-secondary">
        Tints through the colour prop, and an explicit width
      </HoronText>
      <View style={styles.row}>
        <HoronWordmark height={16} color={theme.color("text-brand")} />
        <HoronWordmark height={16} color={theme.color("text-danger")} />
        <HoronWordmark height={16} width={96} />
      </View>
      <HoronText variant="label-sm" tone="text-secondary">
        A custom accessible name, announced as one image
      </HoronText>
      <HoronWordmark height={11.5} title="Horon design system" />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
  column: { gap: 16, alignItems: "flex-start" },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 16, alignItems: "center" },
});
