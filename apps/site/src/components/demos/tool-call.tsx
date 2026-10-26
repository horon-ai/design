import { ToolCall } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function ToolCallDemo() {
  return (
    <div className="flex w-full max-w-160 flex-col gap-3">
      <ToolCall
        defaultOpen
        status="done"
        tool={{ icon: <MagnifyingGlass />, name: "Web search" }}
        summary="Searched the web for 'CRM pricing 2026'"
        elapsed="1.6s"
        args={{ query: "CRM pricing 2026 small sales team", max_results: 5 }}
        result={{ results: [{ title: "HubSpot pricing", price: 20 }], took_ms: 1600 }}
      />
      <ToolCall
        status="failed"
        tool={{ icon: <MagnifyingGlass />, name: "Web search" }}
        summary="Searched the web for 'CRM pricing 2026'"
        elapsed="8.0s"
        error="Request timed out after 8s."
      />
    </div>
  );
}
