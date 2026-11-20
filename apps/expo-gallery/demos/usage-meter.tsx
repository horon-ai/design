import { StyleSheet, View } from "react-native";
import { HoronText, UsageMeter } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function UsageMeterDemo() {
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Solid · 0, 64 and 100 percent
      </HoronText>
      <UsageMeter label="Tasks" value={0} detail="0 of 10,000 tasks" note="Resets Nov 1" />
      <UsageMeter label="Tasks" value={64} detail="6,420 of 10,000 tasks" note="Resets Nov 1" />
      <UsageMeter label="Storage" value={100} detail="50 GB of 50 GB" note="Full" />
      <UsageMeter label="Seats" value={42} />
      <HoronText variant="label-sm" tone="text-secondary">
        Glass · the thick glass card
      </HoronText>
      <Backdrop>
        <UsageMeter surface="glass" label="Tasks" value={64} detail="6,420 of 10,000 tasks" note="Resets Nov 1" />
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
