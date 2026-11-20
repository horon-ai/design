import { StyleSheet, View } from "react-native";
import { Banner, Button, HoronText } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function BannerDemo() {
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Info · sm, md, lg
      </HoronText>
      <Banner size="sm">Your workspace is on the free plan.</Banner>
      <Banner size="md">A new model is available for this bot.</Banner>
      <Banner size="lg">Storage is shared across every bot in the workspace.</Banner>
      <HoronText variant="label-sm" tone="text-secondary">
        Danger · announced as an alert
      </HoronText>
      <Banner tone="danger" size="md">
        Your API key expired.
      </Banner>
      <Banner tone="danger" size="lg" action={<Button variant="link">Review</Button>}>
        Your API key expired, so scheduled runs stopped.
      </Banner>
      <HoronText variant="label-sm" tone="text-secondary">
        Glass · with an underlined action
      </HoronText>
      <Backdrop>
        <Banner surface="glass" action="Dismiss">
          Glass keeps the strip legible over imagery.
        </Banner>
        <Banner surface="glass" tone="danger" action="Review">
          The connection dropped.
        </Banner>
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
