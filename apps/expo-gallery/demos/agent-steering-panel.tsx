import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AgentSteeringPanel, HoronText, type SteeringNote } from "@horon-ai/expo";

const initial: SteeringNote[] = [
  { id: "one", text: "Keep the revenue table but drop the chart." },
  { id: "two", text: "Mention the churn dip.", applied: true },
  { id: "three", text: "End with the three talking points." },
];

export default function AgentSteeringPanelDemo() {
  const [paused, setPaused] = useState(false);
  const [notes, setNotes] = useState(initial);
  const [last, setLast] = useState<string | null>(null);

  return (
    <View style={styles.stack}>
      <AgentSteeringPanel
        title="Quarterly revenue review"
        subtitle="Horon · Weekly report"
        status={paused ? "Paused · 2m 10s" : "Running · 2m 10s"}
        paused={paused}
        onPausedChange={setPaused}
        steps={[
          { id: "read", label: "Read the sheet", status: "done", time: "1.4s" },
          { id: "summarise", label: "Summarise the rows", status: "active", time: "0.6s" },
          { id: "write", label: "Write the launch note", status: "todo" },
          { id: "send", label: "Send for review", status: "todo" },
        ]}
        notes={notes}
        onApplyNow={(id) =>
          setNotes((current) => current.map((note) => (note.id === id ? { ...note, applied: true } : note)))
        }
        onRemoveNote={(id) => setNotes((current) => current.filter((note) => note.id !== id))}
        onSteer={(text, interrupt) => {
          setLast(`${interrupt ? "interrupted" : "queued"}: ${text}`);
          setNotes((current) => [...current, { id: `note-${current.length + 1}-${Date.now()}`, text }]);
        }}
      />
      <HoronText variant="caption" tone="text-secondary">
        {last ?? "Send a steer to queue it for the next step."}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
