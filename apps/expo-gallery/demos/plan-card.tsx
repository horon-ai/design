import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HoronText, PlanCard, PlanStep, type PlanCardStatus } from "@horon-ai/expo";

const order: (PlanCardStatus | undefined)[] = [undefined, "running", "failed"];

export default function PlanCardDemo() {
  const [status, setStatus] = useState<PlanCardStatus | undefined>("running");
  const next = () => setStatus((current) => order[(order.indexOf(current) + 1) % order.length]);

  return (
    <View style={styles.stack}>
      <PlanCard
        label="Plan · 3 steps"
        title="Ship the parser"
        status={status}
        statusLabel={status === "failed" ? "Stopped · step 2 failed" : "Running · 1 of 3"}
        elapsed={status === undefined ? undefined : "1m 20s"}
      >
        <PlanStep status="done" index={1} title="Read the spec" elapsed="2s" />
        <PlanStep
          status={status === "failed" ? "failed" : "running"}
          index={2}
          title="Write the parser"
          tool="tsc.compile"
          error={status === "failed" ? "Unexpected token at line 84." : undefined}
          onRetry={() => setStatus("running")}
        />
        <PlanStep status="pending" index={3} title="Publish" last />
      </PlanCard>
      <Button size="sm" variant="solid" onPress={next}>
        Cycle the footer
      </Button>
      <HoronText variant="caption" tone="text-secondary">
        {status ? `footer: ${status}` : "footer collapsed"}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
