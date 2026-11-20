import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Globe, Terminal, Wrench } from "phosphor-react-native";
import { Button, HoronText, ToolCall, ToolCallsHeader } from "@horon-ai/expo";

export default function ToolCallsHeaderDemo() {
  const [open, setOpen] = useState(true);
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Default open · three chips, two tool calls
      </HoronText>
      <ToolCallsHeader icons={[<Globe key="globe" />, <Terminal key="terminal" />, <Wrench key="wrench" />]} elapsed="4.0s">
        <ToolCall
          status="done"
          tool={{ icon: <Globe />, name: "Web search" }}
          summary="Searched the docs"
          result={{ results: 8 }}
        />
        <ToolCall
          status="running"
          tool={{ icon: <Terminal />, name: "Run command" }}
          summary="Building the tokens"
        />
      </ToolCallsHeader>
      <HoronText variant="label-sm" tone="text-secondary">
        Starts closed · custom title, no icons
      </HoronText>
      <ToolCallsHeader title="Tools ran" defaultOpen={false} elapsed="0.4s">
        <ToolCall
          status="done"
          tool={{ icon: <Wrench />, name: "Format" }}
          summary="Formatted 12 files"
          result="ok"
        />
      </ToolCallsHeader>
      <HoronText variant="label-sm" tone="text-secondary">
        Controlled · {open ? "open" : "closed"}
      </HoronText>
      <ToolCallsHeader open={open} onOpenChange={setOpen} icons={[<Globe key="globe" />]} elapsed="1.1s">
        <ToolCall
          status="done"
          tool={{ icon: <Globe />, name: "Web search" }}
          summary="Read the release notes"
          result={{ pages: 3 }}
        />
      </ToolCallsHeader>
      <Button variant="solid" size="sm" onPress={() => setOpen((value) => !value)}>
        Toggle from the parent
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
