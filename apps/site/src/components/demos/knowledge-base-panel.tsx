import { KnowledgeBasePanel, SourceRow } from "@horon-ai/react";
import { EnvelopeSimple, FileText, Globe } from "@phosphor-icons/react";
import { useState } from "react";

import { Backdrop } from "../demo-backdrop";

export default function KnowledgeBasePanelDemo() {
  const [dropped, setDropped] = useState<string[]>([]);
  return (
    <Backdrop>
      <div className="w-full max-w-200 overflow-x-auto">
        <KnowledgeBasePanel
          className="min-w-112"
          title="Company knowledge"
          meta={`${3 + dropped.length} sources · 286 chunks · Used by 3 bots`}
          tabs={[
            { id: "sources", label: "Sources", count: 3 + dropped.length },
            { id: "retrieval", label: "Test retrieval" },
          ]}
          indexing={1 + dropped.length}
          onFiles={(files) => setDropped((names) => [...names, ...files.map((file) => file.name)])}
        >
          <SourceRow
            variant="list"
            status="ready"
            icon={<FileText />}
            name="Refund and cancellation policy.pdf"
            detail="12 pages · 45 chunks · Uploaded Oct 14"
          />
          <SourceRow
            variant="list"
            status="failed"
            icon={<EnvelopeSimple />}
            name="Investor threads"
            detail="Embedding timed out after 41 of 68 chunks"
            onRetry={() => undefined}
          />
          <SourceRow
            variant="list"
            status="indexing"
            icon={<Globe />}
            name="help.horon.ai"
            detail="Embedding · 140 of 296 chunks"
            progress={62}
          />
          {dropped.map((name) => (
            <SourceRow
              key={name}
              variant="list"
              status="indexing"
              icon={<FileText />}
              name={name}
              detail="Parsing · queued"
              progress={0}
              stages={["active", "todo", "todo", "todo"]}
            />
          ))}
        </KnowledgeBasePanel>
      </div>
    </Backdrop>
  );
}
