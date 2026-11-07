import { ToolCall, ToolCallsHeader } from "@horon-ai/react";
import { FileText, MagnifyingGlass } from "@phosphor-icons/react";

export default function ToolCallsHeaderThumbnail() {
  return (
    <div className="w-[356px]">
      <ToolCallsHeader
        open
        icons={[<MagnifyingGlass key="search" aria-hidden />, <FileText key="doc" aria-hidden />]}
        elapsed="4.0s"
      >
        <ToolCall
          status="done"
          tool={{ icon: <MagnifyingGlass aria-hidden />, name: "Search" }}
          summary="Q3 benchmarks"
          elapsed="1.2s"
        />
        <ToolCall
          status="running"
          tool={{ icon: <FileText aria-hidden />, name: "Docs" }}
          summary="Update template"
        />
      </ToolCallsHeader>
    </div>
  );
}
