import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HoronText, Switch } from "@horon-ai/expo";

/** The four rungs, controlled and uncontrolled state, labelled rows and the locked states. */
export default function SwitchDemo() {
  const [remember, setRemember] = useState(true);
  const [live, setLive] = useState(false);

  return (
    <View style={styles.stack}>
      <View style={styles.row}>
        <Switch defaultChecked accessibilityLabel="Small, on" size="sm" />
        <Switch defaultChecked accessibilityLabel="Medium, on" size="md" />
        <Switch defaultChecked accessibilityLabel="Large, on" size="lg" />
        <Switch defaultChecked accessibilityLabel="Compact, on" size="compact" />
      </View>
      <View style={styles.row}>
        <Switch accessibilityLabel="Small, off" size="sm" />
        <Switch accessibilityLabel="Medium, off" size="md" />
        <Switch accessibilityLabel="Large, off" size="lg" />
        <Switch accessibilityLabel="Compact, off" size="compact" />
      </View>
      <Switch
        label="Remember this bot's memory"
        size="compact"
        checked={remember}
        onCheckedChange={setRemember}
      />
      <Switch label="Live activity" checked={live} onCheckedChange={setLive} />
      <Switch label="Disabled, on" defaultChecked disabled />
      <Switch label="Disabled, off" disabled />
      <Switch label="Read only" defaultChecked readOnly />
      <HoronText tone="text-secondary">
        memory {remember ? "on" : "off"} · live {live ? "on" : "off"}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 16, alignItems: "center" },
});
