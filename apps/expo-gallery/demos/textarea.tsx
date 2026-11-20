import { StyleSheet, View } from "react-native";
import { HoronText, Textarea } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function TextareaDemo() {
  return (
    <View style={styles.stack}>
      <HoronText variant="label-md">Sizes · 88 / 112 / 136pt floors</HoronText>
      <Textarea accessibilityLabel="Small note" size="sm" placeholder="sm" />
      <Textarea accessibilityLabel="Medium note" size="md" placeholder="md" defaultValue="The default rung, 112pt." />
      <Textarea accessibilityLabel="Large note" size="lg" placeholder="lg" />

      <HoronText variant="label-md">States</HoronText>
      <Textarea accessibilityLabel="Invalid note" invalid defaultValue="Marked invalid." />
      <Textarea accessibilityLabel="Disabled note" disabled defaultValue="Locked." />
      <Textarea accessibilityLabel="Read-only note" readOnly defaultValue="Selectable, not editable." />

      <HoronText variant="label-md">Surfaces</HoronText>
      <Textarea accessibilityLabel="On-page note" surface="solid-on-page" placeholder="solid-on-page" />
      <Backdrop>
        <Textarea accessibilityLabel="Glass note" surface="glass" placeholder="glass" />
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
