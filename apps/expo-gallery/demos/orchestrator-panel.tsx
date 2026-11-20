import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AgentLane, HoronText, OrchestratorPanel } from "@horon-ai/expo";

export default function OrchestratorPanelDemo() {
  const [parallel, setParallel] = useState(2);
  const [stopped, setStopped] = useState(false);

  return (
    <View style={styles.stack}>
      <OrchestratorPanel
        title={stopped ? "Orchestrator · stopped" : "Orchestrator"}
        parallelOptions={[1, 2, 3]}
        parallelValue={parallel}
        onParallelChange={setParallel}
        onStop={() => setStopped(true)}
        lead={{
          initial: "H",
          name: "Horon",
          role: "Lead",
          status: stopped ? "Stopped" : `${parallel} working`,
          running: !stopped,
          elapsed: "2m 10s",
        }}
        plan={[
          { label: "Collect sources" },
          { label: "Draft the summary", running: !stopped },
          { label: "Hand the draft to review" },
        ]}
        summary={{ count: "1 of 2 returned", body: "The writer is still drafting; the researcher is done." }}
      >
        <AgentLane
          status="done"
          bot={{ initial: "R", name: "Researcher" }}
          task="Collect sources"
          output="Six sources, two charts."
        />
        <AgentLane
          status={stopped ? "failed" : "running"}
          bot={{ initial: "W", name: "Writer" }}
          task="Draft the summary"
          output={stopped ? "Stopped by the lead." : undefined}
        />
      </OrchestratorPanel>
      <HoronText variant="caption" tone="text-secondary">
        parallel: {parallel} · {stopped ? "stopped" : "running"}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
