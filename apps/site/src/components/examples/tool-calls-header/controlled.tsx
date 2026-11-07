import { Button, ToolCall, ToolCallsHeader } from "@horon-ai/react";
import { FileText, MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";

export default function ToolCallsHeaderControlled() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full max-w-140 flex-col gap-3">
      <ToolCallsHeader
        open={open}
        onOpenChange={setOpen}
        icons={[<MagnifyingGlass key="search" aria-hidden />]}
        title="Using tools…"
        elapsed="2.4s"
      >
        <ToolCall
          status="done"
          tool={{ icon: <MagnifyingGlass aria-hidden />, name: "Web search" }}
          summary="Blur radius guidance"
          elapsed="1.1s"
        />
        <ToolCall
          status="done"
          tool={{ icon: <FileText aria-hidden />, name: "Docs" }}
          summary="Contrast minimums"
          elapsed="0.8s"
        />
      </ToolCallsHeader>
      <Button variant="solid" size="sm" onClick={() => setOpen((value) => !value)}>
        {open ? "Collapse the group" : "Expand the group"}
      </Button>
    </div>
  );
}
