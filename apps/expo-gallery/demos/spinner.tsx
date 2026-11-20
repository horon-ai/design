import { StyleSheet, View } from "react-native";
import { HoronText, Spinner } from "@horon-ai/expo";

/** Named rungs, one-off pixel sizes and the labelled spinner in a sentence. */
export default function SpinnerDemo() {
  return (
    <View style={styles.stack}>
      <View style={styles.row}>
        <Spinner size="xs" />
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </View>
      <View style={styles.row}>
        <Spinner size={12} />
        <Spinner size={15} />
        <Spinner size={20} />
        <Spinner size={40} />
      </View>
      <View style={styles.row}>
        <Spinner size="sm" label="Saving" />
        <HoronText tone="text-secondary">Saving</HoronText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 16, alignItems: "center" },
});
