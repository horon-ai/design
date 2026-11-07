import { ToolCall, ToolCallsHeader } from "@horon-ai/react";
import { Globe, Terminal } from "@phosphor-icons/react";

export default function ToolCallsHeaderCollapsed() {
  return (
    <div className="flex w-full max-w-140 flex-col">
      <ToolCallsHeader
        defaultOpen={false}
        icons={[<Globe key="globe" aria-hidden />, <Terminal key="terminal" aria-hidden />]}
        title="Used 2 tools"
        elapsed="1.8s"
      >
        <ToolCall
          status="done"
          tool={{ icon: <Globe aria-hidden />, name: "Web search" }}
          summary="Q3 revenue benchmarks"
          elapsed="1.2s"
        />
        <ToolCall
          status="failed"
          tool={{ icon: <Terminal aria-hidden />, name: "Shell" }}
          summary="npm test"
          error="Command exited with status 1"
          onRetry={() => undefined}
        />
      </ToolCallsHeader>
    </div>
  );
}
