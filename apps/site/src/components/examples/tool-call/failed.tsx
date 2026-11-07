import { ToolCall } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";

export default function ToolCallFailed() {
  const [attempt, setAttempt] = useState(1);
  return (
    <ToolCall
      key={attempt}
      defaultOpen
      status="failed"
      tool={{ icon: <MagnifyingGlass aria-hidden />, name: "Web search" }}
      summary="Searched the web for 'CRM pricing 2026'"
      elapsed="8.0s"
      args={{ query: "CRM pricing 2026 small sales team" }}
      error="Request timed out after 8s."
      onRetry={() => setAttempt((value) => value + 1)}
    />
  );
}
