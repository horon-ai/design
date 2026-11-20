import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BotMemoryPanel, HoronText } from "@horon-ai/expo";

const memories = [
  { id: "m1", text: "Prefers Korean replies in chat", source: "From a chat · Oct 8", group: "Preference" },
  { id: "m2", text: "Reports go to the board template", source: "From a chat · Oct 8", group: "Preference", fresh: true },
  { id: "m3", text: "Launch date is Nov 21", source: "From a chat · Oct 9", group: "Schedule" },
  { id: "m4", text: "Freeze non-essential work on launch week", source: "From a doc · Oct 11", group: "Schedule" },
];

/** The full panel with switches, filters, a fresh memory and a toast, then a full meter. */
export default function BotMemoryPanelDemo() {
  const [toast, setToast] = useState<{ title: string; message?: string } | undefined>({
    title: "Memory updated",
    message: "Saved a preference",
  });
  const [changes, setChanges] = useState<string[]>([]);
  return (
    <View style={styles.stack}>
      <BotMemoryPanel
        usage={42}
        subtitle="4 memories saved"
        settings={[
          { id: "auto", label: "Memory", description: "Let the assistant remember chats", defaultChecked: true },
          { id: "shared", label: "Shared memory", description: "Use the workspace's saved facts" },
        ]}
        memories={memories}
        toast={toast}
        onToastDismiss={() => setToast(undefined)}
        onSettingChange={(id, checked) => setChanges((previous) => [`${id}: ${checked}`, ...previous].slice(0, 2))}
        onSearch={() => undefined}
        onAdd={() => setToast({ title: "Memory added" })}
      />
      {changes.length > 0 ? (
        <HoronText variant="caption" tone="text-secondary">
          {changes.join(" · ")}
        </HoronText>
      ) : null}
      <BotMemoryPanel usage={130} title="Memory" memories={memories.slice(2)} />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 20 },
});
