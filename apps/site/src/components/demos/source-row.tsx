import { Button, SourceRow } from "@horon-ai/react";
import { EnvelopeSimple, FileText, Globe } from "@phosphor-icons/react";
import { useState } from "react";

function InteractiveIndexing() {
  const [progress, setProgress] = useState(42);
  return (
    <div className="flex w-full flex-col gap-2">
      <SourceRow
        status="indexing"
        icon={<Globe />}
        name="wiki.horon.ai"
        detail={`Embedding · ${Math.round((progress * 296) / 100)} of 296 chunks`}
        progress={progress}
      />
      <div>
        <Button size="sm" variant="solid" onClick={() => setProgress((value) => Math.min(100, value + 17))}>
          Advance progress
        </Button>
      </div>
    </div>
  );
}

export default function SourceRowDemo() {
  return (
    <div className="flex w-full max-w-190 flex-col gap-2">
      <InteractiveIndexing />
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
      <div className="flex flex-col">
        <SourceRow
          variant="list"
          status="ready"
          icon={<FileText />}
          name="Pricing FAQ.pdf"
          detail="8 pages · 31 chunks · Uploaded Oct 9"
        />
        <SourceRow
          variant="list"
          status="indexing"
          icon={<Globe />}
          name="docs.horon.ai"
          detail="Embedding · 90 of 296 chunks"
          progress={30}
        />
      </div>
    </div>
  );
}
