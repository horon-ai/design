import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HoronText, Radio, RadioGroup } from "@horon-ai/expo";

/** Each rung, a controlled group, a disabled group and a lone radio. */
export default function RadioGroupDemo() {
  const [repeat, setRepeat] = useState("week");

  return (
    <View style={styles.stack}>
      <RadioGroup size="sm" defaultValue="low" aria-label="Priority, small">
        <Radio value="low" label="Low" />
        <Radio value="high" label="High" />
      </RadioGroup>
      <RadioGroup size="md" defaultValue="day" aria-label="Repeat, medium">
        <Radio value="day" label="Every day" />
        <Radio value="week" label="Every week" />
      </RadioGroup>
      <RadioGroup size="lg" defaultValue="never" aria-label="Reminders, large">
        <Radio value="never" label="Never" />
        <Radio value="always" label="Always" />
      </RadioGroup>
      <RadioGroup value={repeat} onValueChange={setRepeat} aria-label="Repeat">
        <Radio value="day" label="Every day" />
        <Radio value="week" label="Every week" />
        <Radio value="month" label="Every month" disabled />
      </RadioGroup>
      <RadioGroup defaultValue="one" disabled aria-label="Disabled group">
        <Radio value="one" label="One" />
        <Radio value="two" label="Two" />
      </RadioGroup>
      <Radio value="solo" label="Lone radio" />
      <HoronText tone="text-secondary">repeat {repeat}</HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
