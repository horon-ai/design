import { ToolCall } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function ToolCallThumbnail() {
  return (
    <div className="flex w-88 flex-col gap-2.5">
      <ToolCall
        status="done"
        tool={{ icon: <MagnifyingGlass aria-hidden />, name: "Web search" }}
        summary="CRM pricing 2026"
      />
      <ToolCall
        status="running"
        tool={{ icon: <MagnifyingGlass aria-hidden />, name: "Web search" }}
        summary="Reading hubspot.com"
      />
    </div>
  );
}
