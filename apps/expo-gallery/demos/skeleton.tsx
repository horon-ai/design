import { StyleSheet, View } from "react-native";
import { HoronText, Skeleton, SkeletonCard } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

/** Blocks and pills, the three card arrangements and the glass card over imagery. */
export default function SkeletonDemo() {
  return (
    <View style={styles.stack}>
      <View style={styles.row}>
        <Skeleton shape="pill" style={{ width: 36, height: 36 }} />
        <Skeleton style={{ width: 160, height: 8 }} />
        <Skeleton style={{ width: 96, height: 12 }} />
      </View>
      <SkeletonCard />
      <SkeletonCard type="card" />
      <SkeletonCard type="text" />
      <Backdrop>
        <SkeletonCard surface="glass" />
        <SkeletonCard surface="glass" type="text" />
      </Backdrop>
      <HoronText tone="text-secondary">Loading</HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center" },
});
