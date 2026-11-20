import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AgentLanesTimeline, Button, HoronText } from "@horon-ai/expo";

export default function AgentLanesTimelineDemo() {
  const [approved, setApproved] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);

  return (
    <View style={styles.stack}>
      <AgentLanesTimeline
        statuses={[
          { id: "running", tone: "live", label: "2 running" },
          { id: "idle", tone: "ink", label: "1 idle" },
        ]}
        cursor={cursor}
        bots={[
          {
            id: "researcher",
            name: "Researcher",
            tools: "Notion · Drive",
            initial: "R",
            tone: "sky",
            badge: "Idle",
            tasks: [
              { id: "pull", label: "Pull metrics", tone: "done", start: -28, end: -16 },
              { id: "compare", label: "Compare quarters", tone: "done", start: -16, end: -6 },
            ],
          },
          {
            id: "writer",
            name: "Writer",
            tools: "Docs",
            initial: "W",
            tone: "steel",
            badge: "Needs you",
            badgeTone: "ink",
            tasks: [
              { id: "outline", label: "Outline", tone: "done", start: -26, end: -18 },
              { id: "draft", label: "Draft summary", tone: "running", start: -14, end: 0 },
              { id: "publish", label: "Publish", tone: "waiting", start: -4, end: 4 },
            ],
          },
          {
            id: "analyst",
            name: "Analyst",
            initial: "A",
            tone: "neutral",
            tasks: [{ id: "audit", label: "Audit", tone: "failed", start: -22, end: -10, badge: "Needs you" }],
          },
        ]}
        handoffs={[
          { from: "pull", to: "outline" },
          { from: "compare", to: "draft" },
          { from: "draft", to: "audit" },
        ]}
        approval={{
          message: "Approve publishing the summary before the bot sends it?",
          onLater: () => setApproved("Later"),
          onApprove: () => setApproved("Approve"),
        }}
        onRangeClick={() => setCursor((value) => (value === 0 ? 6 : 0))}
      />
      <View style={styles.row}>
        <Button size="sm" variant="solid" onPress={() => setCursor((value) => (value === 0 ? 6 : 0))}>
          Move the now line
        </Button>
        <Button size="sm" variant="solid" onPress={() => setApproved(null)}>
          Reset the strip
        </Button>
        <HoronText variant="caption" tone="text-secondary">
          {approved ? `approval: ${approved}` : "no approval yet"} · cursor {cursor} min
        </HoronText>
      </View>
      <HoronText variant="caption" tone="text-secondary">
        Tap the range pill to jump the now line; the track scrolls sideways under 700pt.
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 12 },
});
