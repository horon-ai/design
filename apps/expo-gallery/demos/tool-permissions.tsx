import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HoronText, ToolPermissions, type ToolPermission } from "@horon-ai/expo";

const TOOLS = [
  { name: "web_search", description: "Read public pages", defaultValue: "allow" as const },
  { name: "shell", description: "Run local commands" },
  { name: "workspace_write", description: "Change files in this workspace" },
];

export default function ToolPermissionsDemo() {
  const [values, setValues] = useState<Record<string, ToolPermission>>({
    web_search: "allow",
    shell: "off",
    workspace_write: "ask",
  });
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Uncontrolled · seeded from each tool's defaultValue
      </HoronText>
      <ToolPermissions title="Tool access" tools={TOOLS} />
      <HoronText variant="label-sm" tone="text-secondary">
        Controlled · Allow all writes through onValuesChange
      </HoronText>
      <ToolPermissions title="Tool access" tools={TOOLS} values={values} onValuesChange={setValues} />
      <HoronText variant="label-sm" tone="text-secondary">
        {Object.entries(values)
          .map(([name, value]) => `${name}: ${value}`)
          .join(" · ")}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
