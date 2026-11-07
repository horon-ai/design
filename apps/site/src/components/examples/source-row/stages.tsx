import { SourceRow } from "@horon-ai/react";
import { FilePdf } from "@phosphor-icons/react";

export default function SourceRowStages() {
  return (
    <div className="flex w-full max-w-190 flex-col gap-2">
      <SourceRow
        status="indexing"
        icon={<FilePdf aria-hidden />}
        name="Q4 launch brief.pdf"
        detail="Parsing · 12 of 42 pages"
        progress={28}
        stages={["active", "todo", "todo", "todo"]}
      />
      <SourceRow
        status="indexing"
        icon={<FilePdf aria-hidden />}
        name="Refund and cancellation policy.pdf"
        detail="Chunking · 45 of 120 chunks"
        progress={38}
        stages={["done", "active", "todo", "todo"]}
      />
    </div>
  );
}
