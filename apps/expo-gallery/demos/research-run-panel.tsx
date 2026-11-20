import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HoronText, ResearchRunPanel } from "@horon-ai/expo";

export default function ResearchRunPanelDemo() {
  const [running, setRunning] = useState(true);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [toggles, setToggles] = useState(0);
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Running · status line, staggered queries, sources pill
      </HoronText>
      <ResearchRunPanel
        question="What changed in the EU AI Act this year?"
        statusLabel="Reading sources"
        elapsed="12s"
        read={4}
        total={12}
        queries={[
          { id: "1", text: "EU AI Act amendments", results: "8 results" },
          { id: "2", text: "Enforcement timeline" },
          { id: "3", text: "Member state guidance", state: "searching" },
        ]}
        sources={["EU", "CE", "UK"]}
        running={running}
        onStop={() => setRunning(false)}
        onOpenSources={() => setToggles((count) => count + 1)}
        onToggleStatus={() => setToggles((count) => count + 1)}
        onFollowUp={(value) => setFollowUps((list) => [...list, value])}
      />
      <HoronText variant="label-sm" tone="text-secondary">
        Finished · no status block, the round button sends
      </HoronText>
      <ResearchRunPanel
        question="Summarise the Q3 usage report"
        running={false}
        newLabel="New question"
        queries={[{ id: "1", text: "Q3 usage report", results: "1 source" }]}
        sources={["Q3"]}
        onNewResearch={() => setRunning(true)}
        onFollowUp={(value) => setFollowUps((list) => [...list, value])}
      />
      <HoronText variant="label-sm" tone="text-secondary">
        {followUps.length === 0 ? "no follow-ups yet" : `follow-ups: ${followUps.join(" · ")}`}
        {toggles > 0 ? ` · pill and status pressed ${toggles} times` : ""}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
