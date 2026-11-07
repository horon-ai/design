import { JsonCode, ToolCall } from "@horon-ai/react";
import { Database } from "@phosphor-icons/react";

const summary = {
  rows: 18,
  columns: ["month", "mrr", "arr"],
  sample: [{ month: "Jul", mrr: 184000, arr: 2208000 }],
  cached: false,
};

export default function ToolCallTruncated() {
  return (
    <div className="flex w-full max-w-160 flex-col gap-3">
      <ToolCall
        defaultOpen
        truncated
        status="done"
        tool={{ icon: <Database aria-hidden />, name: "stripe.query" }}
        summary="Pulled Q3 revenue and ARR"
        elapsed="1.3s"
        args={{ range: "2026-07-01..2026-09-30", group_by: "month" }}
        result={summary}
        onShowAll={() => undefined}
      />
      <div className="rounded-2xl border border-border-default bg-bg-surface px-4 py-3.5">
        <JsonCode value={summary} />
      </div>
    </div>
  );
}
