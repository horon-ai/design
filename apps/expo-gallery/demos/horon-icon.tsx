import { StyleSheet, View } from "react-native";
import { HoronGlyph, HoronIcon, HoronText, iconNames, useHoronTheme } from "@horon-ai/expo";

export default function HoronIconDemo() {
  const theme = useHoronTheme();

  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Three sizes and two tints
      </HoronText>
      <View style={styles.row}>
        <HoronIcon size={16} />
        <HoronIcon size={22} />
        <HoronIcon size={32} />
        <HoronIcon size={48} color={theme.color("text-brand")} />
        <HoronIcon size={48} color={theme.color("text-danger")} />
      </View>
      <HoronText variant="label-sm" tone="text-secondary">
        The registry: `horon` plus every Phosphor glyph, as data
      </HoronText>
      <View style={styles.grid}>
        {iconNames.map((name) => (
          <View key={name} style={styles.cell}>
            <HoronGlyph name={name} size={20} color={theme.color("text-secondary")} />
            <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
              {name}
            </HoronText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 16, alignItems: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  cell: { width: 72, alignItems: "center", gap: 4 },
});
