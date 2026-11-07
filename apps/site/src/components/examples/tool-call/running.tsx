import { ToolCall } from "@horon-ai/react";
import { FileText } from "@phosphor-icons/react";

export default function ToolCallRunning() {
  return (
    <ToolCall
      defaultOpen
      status="running"
      tool={{ icon: <FileText aria-hidden />, name: "Read document" }}
      summary="Opening 'Q3 board deck.pdf'"
      elapsed="0.4s"
      args={{ path: "Drive/Board/Q3 board deck.pdf" }}
    />
  );
}
