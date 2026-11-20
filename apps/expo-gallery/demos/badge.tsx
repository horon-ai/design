import { StyleSheet, View } from "react-native";
import { Badge, HoronText } from "@horon-ai/expo";

/** Every tone, rung and the status dot, alone and inside running text. */
export default function BadgeDemo() {
  return (
    <View style={styles.stack}>
      <View style={styles.row}>
        <Badge>Neutral</Badge>
        <Badge tone="brand">Brand</Badge>
        <Badge tone="danger">Danger</Badge>
        <Badge tone="solid">Solid</Badge>
        <Badge tone="surface">Surface</Badge>
      </View>
      <View style={styles.row}>
        <Badge tone="brand" dot>
          Running
        </Badge>
        <Badge tone="danger" dot>
          Failed
        </Badge>
        <Badge tone="neutral" dot>
          Queued
        </Badge>
        <Badge tone="solid" dot>
          New
        </Badge>
      </View>
      <View style={styles.row}>
        <Badge size="sm" tone="brand" dot>
          Small
        </Badge>
        <Badge size="md" tone="brand" dot>
          Medium
        </Badge>
        <Badge size="lg" tone="brand" dot>
          Large
        </Badge>
      </View>
      <View style={[styles.row, { gap: 6 }]}>
        <HoronText tone="text-secondary">4 bots</HoronText>
        <Badge tone="brand" size="sm">
          live
        </Badge>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
});
