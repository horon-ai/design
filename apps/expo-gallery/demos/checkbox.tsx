import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Checkbox, HoronText } from "@horon-ai/expo";

/** The three rungs, the mixed state, controlled and uncontrolled rows and the locked states. */
export default function CheckboxDemo() {
  const [remember, setRemember] = useState(true);
  const [notify, setNotify] = useState(true);

  return (
    <View style={styles.stack}>
      <View style={styles.row}>
        <Checkbox defaultChecked label="Small" size="sm" />
        <Checkbox defaultChecked label="Medium" size="md" />
        <Checkbox defaultChecked label="Large" size="lg" />
      </View>
      <View style={styles.row}>
        <Checkbox label="Unchecked" />
        <Checkbox defaultChecked label="Checked" />
        <Checkbox indeterminate label="Mixed" />
      </View>
      <Checkbox label="Remember this chat" checked={remember} onCheckedChange={setRemember} />
      <Checkbox label="Send me a notification" checked={notify} onCheckedChange={setNotify} />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled, checked" defaultChecked disabled />
      <Checkbox label="Read only" defaultChecked readOnly />
      <Checkbox accessibilityLabel="Select all rows" indeterminate />
      <HoronText tone="text-secondary">
        memory {remember ? "on" : "off"} · notify {notify ? "on" : "off"}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 16, alignItems: "center" },
});
