import { SourceRow } from "@horon-ai/react";
import { EnvelopeSimple, FileText, Globe } from "@phosphor-icons/react";

export default function SourceRowDemo() {
  return (
    <div className="flex w-full max-w-190 flex-col gap-2">
      <SourceRow
        status="ready"
        icon={<FileText />}
        name="Refund and cancellation policy.pdf"
        detail="12 pages · 45 chunks · Uploaded Oct 14"
      />
      <SourceRow
        status="indexing"
        icon={<Globe />}
        name="help.horon.ai"
        detail="Embedding · 140 of 296 chunks"
        progress={62}
      />
      <SourceRow
        status="failed"
        icon={<EnvelopeSimple />}
        name="Investor threads"
        detail="Embedding timed out after 41 of 68 chunks"
        onRetry={() => undefined}
      />
    </div>
  );
}
