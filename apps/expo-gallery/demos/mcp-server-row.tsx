import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HoronText, McpServerRow, MenuItem, MenuSeparator } from "@horon-ai/expo";

/** All three status tones, tags and brand tags, meta lines, and rows with and without the overflow menu. */
export default function McpServerRowDemo() {
  const [last, setLast] = useState("nothing yet");
  return (
    <View style={styles.stack}>
      <McpServerRow
        name="Linear"
        tags={["Official"]}
        brandTags={["All devices"]}
        description="Read issues and projects, and move a card when a run finishes."
        meta={["12 tools", "OAuth"]}
        onConfigure={() => setLast("configure Linear")}
        menu={
          <>
            <MenuItem onClick={() => setLast("reconnect Linear")}>Reconnect</MenuItem>
            <MenuItem trailing="⌘D" onClick={() => setLast("duplicate Linear")}>
              Duplicate
            </MenuItem>
            <MenuSeparator />
            <MenuItem danger onClick={() => setLast("remove Linear")}>
              Remove
            </MenuItem>
          </>
        }
      />
      <McpServerRow
        name="Figma"
        tags={["Official", "Beta"]}
        description="Needs a new access token before it can read files."
        meta={["4 tools"]}
        statusLabel="Needs attention"
        statusTone="warning"
        onConfigure={() => setLast("configure Figma")}
      />
      <McpServerRow
        name="Filesystem"
        description="Local files under the workspace folder."
        meta={["6 tools", "stdio"]}
        statusLabel="Idle"
        statusTone="neutral"
        onConfigure={() => setLast("configure Filesystem")}
        menu={<MenuItem onClick={() => setLast("restart Filesystem")}>Restart</MenuItem>}
      />
      <McpServerRow name="Sentry" meta={["2 tools"]} style={{ borderBottomWidth: 0 }} />
      <HoronText variant="caption" tone="text-secondary">
        last action: {last}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { maxWidth: 560 },
});
