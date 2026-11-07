import { ToolCall } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function ToolCallDone() {
  return (
    <ToolCall
      defaultOpen
      status="done"
      tool={{ icon: <MagnifyingGlass aria-hidden />, name: "Web search" }}
      summary="Searched the web for 'CRM pricing 2026'"
      elapsed="1.6s"
      args={{ query: "CRM pricing 2026 small sales team", max_results: 5 }}
      result={{ results: [{ title: "HubSpot pricing", price: 20 }], took_ms: 1600 }}
    />
  );
}
