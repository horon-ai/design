import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { DotsThree, Gear, Plus, Trash } from "phosphor-react-native";
import { HoronText, IconButton } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

/** Every variant in three sizes, the disabled disc and the glass discs over imagery. */
export default function IconButtonDemo() {
  const [count, setCount] = useState(0);
  const tap = () => setCount((value) => value + 1);

  return (
    <View style={styles.stack}>
      <View style={styles.row}>
        <IconButton icon={<Plus />} label="New agent" variant="primary" onPress={tap} />
        <IconButton icon={<Gear />} label="Settings" onPress={tap} />
        <IconButton icon={<DotsThree />} label="More actions" variant="solid" onPress={tap} />
        <IconButton icon={<Trash />} label="Delete bot" variant="quiet" onPress={tap} />
      </View>
      <View style={styles.row}>
        <IconButton icon={<Plus />} label="Small primary" size="sm" variant="primary" onPress={tap} />
        <IconButton icon={<Plus />} label="Medium primary" size="md" variant="primary" onPress={tap} />
        <IconButton icon={<Plus />} label="Large primary" size="lg" variant="primary" onPress={tap} />
      </View>
      <View style={styles.row}>
        <IconButton icon={<Gear />} label="Small ghost" size="sm" onPress={tap} />
        <IconButton icon={<Gear />} label="Medium ghost" size="md" onPress={tap} />
        <IconButton icon={<Gear />} label="Large ghost" size="lg" onPress={tap} />
        <IconButton icon={<Gear />} label="Disabled" disabled />
      </View>
      <Backdrop>
        <View style={styles.row}>
          <IconButton icon={<Plus />} label="Glass small" size="sm" variant="glass" onPress={tap} />
          <IconButton icon={<Plus />} label="Glass medium" variant="glass" onPress={tap} />
          <IconButton icon={<Plus />} label="Glass large" size="lg" variant="glass" onPress={tap} />
        </View>
      </Backdrop>
      <HoronText tone="text-secondary">pressed {count}</HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
});
