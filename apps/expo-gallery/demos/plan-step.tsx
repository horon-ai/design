import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HoronText, PlanStep } from "@horon-ai/expo";

export default function PlanStepDemo() {
  const [retries, setRetries] = useState(0);

  return (
    <View style={styles.stack}>
      <PlanStep status="done" index={1} title="Read the brief" description="Six pages, two tables" elapsed="2s" />
      <PlanStep
        status="running"
        index={2}
        title="Search the web for Q3 comparisons"
        description="Comparing three competitors"
        tool="web.search"
        elapsed="0.6s"
      />
      <PlanStep
        status="failed"
        index={3}
        title="Write the summary"
        tool="docs.write"
        error="The workspace refused the write: the document is locked."
        onRetry={() => setRetries((value) => value + 1)}
      />
      <PlanStep status="pending" index={4} title="Send for review" description="Waiting for the writer" last />
      <View style={styles.row}>
        <Button size="sm" variant="solid" onPress={() => setRetries(0)}>
          Reset the retry count
        </Button>
        <HoronText variant="caption" tone="text-secondary">
          retried {retries} times
        </HoronText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 4 },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 12, marginTop: 12 },
});
