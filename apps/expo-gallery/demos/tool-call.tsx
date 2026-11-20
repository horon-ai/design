import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Globe, Terminal } from "phosphor-react-native";
import { HoronText, JsonCode, ToolCall } from "@horon-ai/expo";

export default function ToolCallDemo() {
  const [retries, setRetries] = useState(0);
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Running · collapsed, spinner in the status slot
      </HoronText>
      <ToolCall
        status="running"
        tool={{ icon: <Globe />, name: "Web search" }}
        summary="Searching the Horon docs"
        args={{ query: "Horon design tokens" }}
        result={undefined}
      />
      <HoronText variant="label-sm" tone="text-secondary">
        Done · expanded with arguments, result and copy buttons
      </HoronText>
      <ToolCall
        status="done"
        tool={{ icon: <Globe />, name: "Web search" }}
        summary="Fetched 8 results for Horon tokens"
        elapsed="1.2s"
        args={{ query: "Horon design tokens", limit: 5 }}
        result={{ results: [{ title: "Tokens", url: "https://design.horon.ai/tokens" }], total: 8 }}
        defaultOpen
      />
      <HoronText variant="label-sm" tone="text-secondary">
        Done and truncated · "Show all" under the result
      </HoronText>
      <ToolCall
        status="done"
        tool={{ icon: <Terminal />, name: "Run command" }}
        summary="Ran the token build"
        elapsed="0.8s"
        result="compiled 13 type styles"
        truncated
        defaultOpen
        onShowAll={() => setRetries((count) => count + 1)}
      />
      <HoronText variant="label-sm" tone="text-secondary">
        Failed · error notice with Retry
      </HoronText>
      <ToolCall
        status="failed"
        tool={{ icon: <Terminal />, name: "Run command" }}
        summary="Could not reach the docs host"
        error="getaddrinfo ENOTFOUND docs.horon.ai"
        onRetry={() => setRetries((count) => count + 1)}
        args={{ command: "horon docs pull" }}
        defaultOpen
      />
      <HoronText variant="label-sm" tone="text-secondary">
        JsonCode on its own
      </HoronText>
      <JsonCode value={{ nested: { list: [1, 2, true, null, "text"] } }} />
      <HoronText variant="label-sm" tone="text-secondary">
        retries and show-all pressed {retries} times
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
