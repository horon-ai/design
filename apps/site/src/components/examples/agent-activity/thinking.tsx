import { ThinkingIndicator } from "@horon-ai/react";

export default function AgentActivityThinking() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ThinkingIndicator />
      <ThinkingIndicator label="Searching the workspace…" />
    </div>
  );
}
