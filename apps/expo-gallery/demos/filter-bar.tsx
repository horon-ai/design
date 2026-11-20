import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FilterBar, HoronText } from "@horon-ai/expo";

/** Counts, a disabled option, a controlled bar and the default "Filter" name. */
export default function FilterBarDemo() {
  const [scope, setScope] = useState("all");

  return (
    <View style={styles.stack}>
      <FilterBar
        aria-label="Scope"
        value={scope}
        onValueChange={setScope}
        items={[
          { value: "all", label: "All", count: 12 },
          { value: "agents", label: "Agents", count: 4 },
          { value: "archived", label: "Archived", disabled: true },
        ]}
      />
      <FilterBar
        items={[
          { value: "bots", label: "Bots" },
          { value: "lanes", label: "Lanes" },
          { value: "tasks", label: "Tasks" },
          { value: "memory", label: "Memory" },
          { value: "settings", label: "Settings" },
        ]}
      />
      <HoronText tone="text-secondary">scope {scope}</HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
