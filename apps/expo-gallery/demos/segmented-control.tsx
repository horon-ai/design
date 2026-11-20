import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HoronText, SegmentedControl } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

/** Every rung, every track surface, filled and hugging segments, and the glass track over imagery. */
export default function SegmentedControlDemo() {
  const [view, setView] = useState("active");
  const [scope, setScope] = useState("all");

  return (
    <View style={styles.stack}>
      <SegmentedControl
        aria-label="Projects"
        value={view}
        onValueChange={setView}
        items={[
          { value: "active", label: "Active" },
          { value: "archived", label: "Archived" },
          { value: "trash", label: "Trash", disabled: true },
        ]}
      />
      <SegmentedControl
        aria-label="Projects, small"
        size="sm"
        fill
        items={[
          { value: "active", label: "Active" },
          { value: "archived", label: "Archived" },
        ]}
      />
      <SegmentedControl
        aria-label="Scope, large"
        size="lg"
        defaultValue="week"
        items={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
        ]}
      />
      <SegmentedControl
        aria-label="Page tabs"
        size="tab"
        surface="subtle"
        defaultValue="active"
        items={[
          { value: "active", label: "Active" },
          { value: "archived", label: "Archived" },
        ]}
      />
      <SegmentedControl
        aria-label="Scope"
        size="lg"
        surface="inset"
        value={scope}
        onValueChange={setScope}
        fill
        items={[
          { value: "all", label: "All" },
          { value: "mine", label: "Mine" },
        ]}
      />
      <SegmentedControl
        aria-label="Header filter"
        surface="inset-faint"
        defaultValue="bots"
        items={[
          { value: "bots", label: "Bots" },
          { value: "agents", label: "Agents" },
        ]}
      />
      <Backdrop>
        <SegmentedControl
          aria-label="Glass"
          surface="glass"
          defaultValue="active"
          items={[
            { value: "active", label: "Active" },
            { value: "archived", label: "Archived" },
          ]}
        />
      </Backdrop>
      <HoronText tone="text-secondary">
        view {view} · scope {scope}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
