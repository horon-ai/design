import { ToolCall, ToolCallsHeader } from "@horon-ai/react";
import { FileText, ListBullets, MagnifyingGlass } from "@phosphor-icons/react";

export default function ToolCallsHeaderDemo() {
  return (
    <div className="flex w-full max-w-140 flex-col gap-6">
      <ToolCallsHeader
        icons={[<MagnifyingGlass key="search" aria-hidden />, <FileText key="doc" aria-hidden />, <ListBullets key="list" aria-hidden />]}
        elapsed="4.0s"
      >
        <ToolCall
          status="done"
          tool={{ icon: <MagnifyingGlass aria-hidden />, name: "Web search" }}
          summary="Q3 revenue benchmarks"
          elapsed="1.2s"
          args={{ query: "Q3 SaaS revenue benchmarks" }}
          result={{ hits: 8 }}
        />
        <ToolCall
          status="running"
          tool={{ icon: <FileText aria-hidden />, name: "Docs" }}
          summary="Investor update template"
        />
      </ToolCallsHeader>
      <ToolCallsHeader
        defaultOpen={false}
        icons={[<MagnifyingGlass key="search" aria-hidden />]}
        title="Used 1 tool"
        elapsed="1.2s"
      >
        <ToolCall
          status="done"
          tool={{ icon: <MagnifyingGlass aria-hidden />, name: "Web search" }}
          summary="Q3 revenue benchmarks"
          elapsed="1.2s"
        />
      </ToolCallsHeader>
    </div>
  );
}
