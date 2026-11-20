import { StyleSheet, View } from "react-native";
import { AgentLane, HoronText } from "@horon-ai/expo";
import { NotionLogo } from "phosphor-react-native";

export default function AgentLaneDemo() {
  return (
    <View style={styles.stack}>
      <AgentLane
        status="running"
        bot={{ initial: "R", name: "Researcher" }}
        elapsed="1.9s"
        task="Gather the Q3 metrics from the shared dashboard"
        tool={{ icon: <NotionLogo size={14} />, label: "Notion · Q3 metrics dashboard" }}
        usage="2.6k tokens"
      />
      <AgentLane
        status="done"
        bot={{ initial: "W", name: "Writer" }}
        elapsed="4.2s"
        task="Draft the summary and the three talking points"
        output="Revenue is up 12% against the plan; churn held flat."
        usage="1.4k tokens"
      />
      <AgentLane
        status="failed"
        bot={{ initial: "A", name: "Analyst" }}
        elapsed="0.8s"
        task="Publish the note to the workspace"
        output="Permission denied: the bot cannot edit this page."
        usage="320 tokens"
      />
      <HoronText variant="caption" tone="text-secondary">
        A failed lane carries the danger rim; the running one pulses its tile.
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
