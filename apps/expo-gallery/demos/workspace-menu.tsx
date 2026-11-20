import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HoronText, WorkspaceMenu } from "@horon-ai/expo";

const WORKSPACES = [
  { id: "acme", name: "Acme", meta: "12 members" },
  { id: "labs", name: "Labs", meta: "4 members" },
  { id: "personal", name: "Personal" },
];

export default function WorkspaceMenuDemo() {
  const [current, setCurrent] = useState("acme");
  const [events, setEvents] = useState<string[]>([]);
  const log = (line: string) => setEvents((list) => [line, ...list].slice(0, 4));
  const name = WORKSPACES.find((workspace) => workspace.id === current)?.name ?? current;

  return (
    <View style={styles.stack}>
      <HoronText variant="title-sm">Workspace menu</HoronText>
      <HoronText variant="body-sm" tone="text-secondary">
        The Paper workspace switcher: a solid 256pt menu that checks the current workspace, then offers the
        two workspace actions.
      </HoronText>
      <View style={styles.row}>
        <WorkspaceMenu
          workspaces={WORKSPACES}
          value={current}
          onValueChange={(id) => {
            setCurrent(id);
            log(`picked ${id}`);
          }}
          onCreate={() => log("new workspace")}
          onSettings={() => log("workspace settings")}
          trigger={<Button variant="solid" />}
          triggerChildren={name}
        />
      </View>
      <HoronText variant="body-sm" tone="text-secondary">
        current: {name}
      </HoronText>
      {events.length === 0 ? null : (
        <View style={styles.log}>
          {events.map((line) => (
            <HoronText key={line} variant="caption" tone="text-secondary">
              {line}
            </HoronText>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center" },
  log: { gap: 2 },
});
