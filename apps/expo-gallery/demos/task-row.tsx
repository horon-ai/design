import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HoronText, TaskRow } from "@horon-ai/expo";

export default function TaskRowDemo() {
  const [log, setLog] = useState<string | null>(null);
  const record = (action: string) => () => setLog(action);

  return (
    <View style={styles.stack}>
      <TaskRow
        status="running"
        title="Draft the Q4 launch note"
        elapsed="1m 56s"
        bot={{ initial: "H", name: "Horon" }}
        project="Launch"
        message="Writing the second draft"
        detail="2 drafts · 1 calendar change"
        onCancel={record("cancel · launch note")}
      />
      <TaskRow
        status="review"
        title="Summarise the Q3 metrics"
        elapsed="4m 02s"
        bot={{ initial: "R", name: "Researcher", tileClassName: "bg-sky-600" }}
        project="Weekly report"
        message="Ready for review"
        detail="6 sources · 2 charts"
        onReview={record("review · Q3 metrics")}
        onArchive={record("archive · Q3 metrics")}
      />
      <TaskRow
        status="failed"
        title="Publish the changelog"
        elapsed="0m 41s"
        bot={{ initial: "W", name: "Writer" }}
        project="Releases"
        message="The workspace refused the write"
        detail="Permission denied"
        onRetry={record("retry · changelog")}
      />
      <TaskRow
        status="done"
        title="Sync the calendar"
        elapsed="0m 12s"
        bot={{ initial: "H", name: "Horon" }}
        message="Two events moved"
        detail="Monday standup · Design review"
        onArchive={record("archive · calendar")}
      />

      <View style={styles.list}>
        <TaskRow
          variant="list"
          status="done"
          title="Sync the inbox"
          bot={{ initial: "H", name: "Horon" }}
          message="Marked four threads as handled"
          onArchive={record("archive · inbox")}
        />
        <TaskRow
          variant="list"
          status="running"
          title="Read the research dump"
          bot={{ initial: "R", name: "Researcher" }}
          message="Reading page 4 of 12"
          onCancel={record("cancel · research")}
        />
      </View>

      <HoronText variant="caption" tone="text-secondary">
        {log ?? "Each state offers one action: Cancel, Review, Retry or Archive."}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  list: { flexDirection: "column" },
});
