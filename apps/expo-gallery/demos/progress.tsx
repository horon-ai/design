import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { HoronText, Progress } from "@horon-ai/expo";

/** Determinate values, a value fed from state, a custom range and the indeterminate bar. */
export default function ProgressDemo() {
  const [value, setValue] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => setValue((current) => (current >= 100 ? 0 : current + 12)), 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.stack}>
      <View style={styles.stack}>
        <HoronText variant="label-sm" tone="text-secondary">
          Determinate
        </HoronText>
        <Progress value={0} aria-label="Empty" />
        <Progress value={35} aria-label="Upload" />
        <Progress value={64} aria-label="Upload" aria-valuetext="64 percent" />
        <Progress value={100} aria-label="Complete" />
      </View>
      <View style={styles.stack}>
        <HoronText variant="label-sm" tone="text-secondary">
          Indeterminate
        </HoronText>
        <Progress aria-label="Loading" />
      </View>
      <View style={styles.stack}>
        <HoronText variant="label-sm" tone="text-secondary">
          Custom range and format
        </HoronText>
        <Progress value={7} min={0} max={10} locale="en-US" format={{ maximumFractionDigits: 1 }} aria-label="Steps" />
      </View>
      <View style={styles.stack}>
        <HoronText variant="label-sm" tone="text-secondary">
          Live {value}%
        </HoronText>
        <Progress value={value} aria-label="Progress" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
