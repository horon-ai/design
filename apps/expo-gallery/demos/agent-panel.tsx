import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AgentPanel, Button, ComposerChip, HoronText, TaskComposer } from "@horon-ai/expo";

export default function AgentPanelDemo() {
  const [draft, setDraft] = useState("Draft the Q4 launch note");
  const [started, setStarted] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  return (
    <View style={styles.stack}>
      <AgentPanel
        filter={
          <View style={styles.row}>
            {["all", "running", "done"].map((value) => (
              <Button
                key={value}
                size="sm"
                variant={filter === value ? "primary" : "solid"}
                onPress={() => setFilter(value)}
              >
                {value}
              </Button>
            ))}
          </View>
        }
      >
        <View style={styles.row}>
          <ComposerChip leading="R">Researcher</ComposerChip>
          <ComposerChip leading="W" tileClassName="bg-sky-600">
            Writer
          </ComposerChip>
          <ComposerChip leading="P" disabled>
            Paused bot
          </ComposerChip>
        </View>
        <TaskComposer
          value={draft}
          onValueChange={setDraft}
          onStart={() => setStarted(draft)}
          pickers={
            <>
              <ComposerChip leading="R">Researcher</ComposerChip>
              <ComposerChip leading="L">Launch</ComposerChip>
            </>
          }
        />
        <TaskComposer startLabel="Queue free draft" onStart={() => setStarted("free draft")} />
      </AgentPanel>
      <HoronText variant="caption" tone="text-secondary">
        {started ? `started: ${started}` : "nothing started yet"} · filter: {filter}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
});
