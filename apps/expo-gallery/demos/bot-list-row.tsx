import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BotListRow, HoronText } from "@horon-ai/expo";

const bots = [
  { id: "researcher", name: "Researcher", time: "8:41 AM", preview: "Pulled the Q3 numbers into one sheet" },
  { id: "editor", name: "Editor", time: "Yesterday", preview: "Tightened the launch memo" },
  { id: "planner", name: "Planner", time: "Mon", preview: "Drafted next week's board update" },
];

/** Selected, pressed, running, quiet and disabled rows in one list. */
export default function BotListRowDemo() {
  const [open, setOpen] = useState("researcher");
  return (
    <View style={styles.stack}>
      <View style={styles.list}>
        {bots.map((bot) => (
          <BotListRow
            key={bot.id}
            name={bot.name}
            time={bot.time}
            preview={bot.preview}
            live={bot.id === "researcher"}
            selected={open === bot.id}
            onPress={() => setOpen(bot.id)}
          />
        ))}
      </View>
      <HoronText variant="caption" tone="text-secondary">
        open: {open}
      </HoronText>
      <View style={styles.list}>
        <BotListRow name="Archivist" time="Sun" preview="Indexed 128 chunks overnight" />
        <BotListRow name="Summarizer" />
        <BotListRow name="Billing bot" time="Sep 2" preview="Locked while the workspace is paused" disabled />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  list: { gap: 2, maxWidth: 420 },
});
