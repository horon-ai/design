import { StyleSheet, View } from "react-native";
import { CodeKey, CodePanel, HoronText } from "@horon-ai/expo";

const FRONTMATTER = `---
title: Weekly digest
schedule: 0 9 * * 1
recipients:
  - team@horon.ai
---`;

const LONG_LINE = `curl -X POST https://api.horon.ai/v1/routines -H "Authorization: Bearer $HORON_KEY" -d '{"repeat":"weekly","time":"09:00"}'`;

export default function CodePanelDemo() {
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Frontmatter · keys in the key colour
      </HoronText>
      <CodePanel>
        {"title: "}
        <CodeKey>Weekly digest</CodeKey>
        {"\nschedule: "}
        <CodeKey>0 9 * * 1</CodeKey>
        {"\nrecipients: team@horon.ai"}
      </CodePanel>
      <HoronText variant="label-sm" tone="text-secondary">
        A long line scrolls sideways instead of wrapping
      </HoronText>
      <CodePanel>{LONG_LINE}</CodePanel>
      <CodePanel>{FRONTMATTER}</CodePanel>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
