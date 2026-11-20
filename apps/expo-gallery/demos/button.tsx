import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Plus } from "phosphor-react-native";
import { Button, HoronText } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function ButtonDemo() {
  const [count, setCount] = useState(0);
  const bump = () => setCount((value) => value + 1);
  return (
    <View style={styles.stack}>
      <View style={styles.row}>
        <Button onPress={bump}>Approve</Button>
        <Button variant="solid" icon={<Plus />} onPress={bump}>
          New bot
        </Button>
        <Button variant="danger" onPress={bump}>
          Delete bot
        </Button>
      </View>
      <View style={styles.row}>
        <Button size="sm" variant="solid" onPress={bump}>
          Small
        </Button>
        <Button size="lg" onPress={bump}>
          Large
        </Button>
        <Button disabled>Disabled</Button>
        <Button variant="link" onPress={bump}>
          Show all
        </Button>
        <Button variant="link" aria-current="page">
          Current
        </Button>
      </View>
      <Backdrop>
        <View style={styles.row}>
          <Button variant="glass" onPress={bump}>
            Glass
          </Button>
          <Button variant="glass" size="lg" icon={<Plus />} onPress={bump}>
            Glass large
          </Button>
        </View>
      </Backdrop>
      <HoronText tone="text-secondary">pressed {count}</HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center" },
});
