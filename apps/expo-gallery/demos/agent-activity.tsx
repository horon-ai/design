import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HoronText, StreamingText, ThinkingIndicator, ToolStep, WorkLog } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function AgentActivityDemo() {
  const [text, setText] = useState("The Q3 dashboard has 18 rows.");
  const [streaming, setStreaming] = useState(true);
  const more = () => setText((value) => `${value} Reading the revenue column.`);
  const finish = () => setStreaming(false);

  return (
    <View style={styles.stack}>
      <View style={styles.row}>
        <ThinkingIndicator />
        <ThinkingIndicator label="Searching the workspace…" />
      </View>

      <View style={styles.stack}>
        <ToolStep state="running" title="Search the web" detail="Looking for the Q3 numbers" />
        <ToolStep state="done" title="Read the sheet" detail="18 rows" />
        <ToolStep state="failed" title="Publish the note" detail="Permission denied" />
        <ToolStep state="done" title="Disabled step" detail="Never opens" disabled />
      </View>

      <View style={styles.row}>
        <Button size="sm" variant="solid" onPress={more}>
          Add a chunk
        </Button>
        <Button size="sm" variant="solid" onPress={finish}>
          Finish the stream
        </Button>
        <Button size="sm" variant="link" onPress={() => setStreaming(true)}>
          Restart
        </Button>
      </View>
      <StreamingText text={text} streaming={streaming} />
      <StreamingText text="The stream finished, so the caret is gone." streaming={false} />

      <WorkLog
        summary="3 steps"
        steps={[
          { id: "read", title: "Read the sheet", detail: "18 rows" },
          { id: "draft", title: "Draft the summary", running: true },
          { id: "send", title: "Send the note", detail: "Queued" },
        ]}
      />

      <Backdrop>
        <StreamingText text="Glass backdrops sit under the thinking pill and the bubble." />
        <View style={styles.row}>
          <ThinkingIndicator label="Planning the answer" />
        </View>
      </Backdrop>
      <HoronText variant="caption" tone="text-secondary">
        {streaming ? "Streaming · caret visible" : "Stream complete · answer announced once"}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 12 },
});
