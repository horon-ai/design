import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { CaretRight } from "phosphor-react-native";
import { Card, HoronText, useHoronTheme } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function CardDemo() {
  const theme = useHoronTheme();
  const [opened, setOpened] = useState(0);
  return (
    <View style={styles.stack}>
      <Card title="Weekly digest" description="A summary of everything the assistant saved this week.">
        <HoronText variant="body-sm" tone="text-secondary">
          Solid surface, the default.
        </HoronText>
      </Card>
      <Card
        interactive
        title="Open the digest"
        description="Interactive adds the caret and the press scale."
        onPress={() => setOpened((value) => value + 1)}
      />
      <Card selected title="Selected" description="The brand rim marks the chosen card." />
      <Card
        interactive
        selected
        title="Selected and interactive"
        description="Both states on one card."
        onPress={() => setOpened((value) => value + 1)}
      />
      <Card surface="frost" title="Frost" description="The Paper home board card: denser fill, 6% ink drop." />
      <Backdrop>
        <Card surface="glass" title="Glass" description="Liquid Glass on iOS 26, the frost fallback elsewhere.">
          <View style={styles.inline}>
            <HoronText variant="body-sm">Open registry</HoronText>
            <CaretRight size={16} color={theme.color("text-primary")} />
          </View>
        </Card>
      </Backdrop>
      <HoronText variant="caption" tone="text-secondary">
        opened {opened} times
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  inline: { flexDirection: "row", alignItems: "center", gap: 8 },
});
