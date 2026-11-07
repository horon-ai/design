import { KnowledgeBasePanel, SourceRow } from "@horon-ai/react";
import { EnvelopeSimple, FileText } from "@phosphor-icons/react";
import { useState } from "react";

const tabs = [
  { id: "sources", label: "Sources", count: 2 },
  { id: "retrieval", label: "Test retrieval" },
];

export default function KnowledgeBaseTabs() {
  const [tab, setTab] = useState("sources");
  return (
    <KnowledgeBasePanel
      className="w-full max-w-200"
      title="Company knowledge"
      meta={tab === "sources" ? "2 sources · 76 chunks" : "Last tested 4 minutes ago"}
      tabs={tabs}
      value={tab}
      onValueChange={setTab}
      stages={["Parse", "Chunk", "Embed", "Index"]}
      onSettings={() => undefined}
      onAddSource={() => undefined}
    >
      <SourceRow
        variant="list"
        status="ready"
        icon={<FileText aria-hidden />}
        name="Pricing FAQ.pdf"
        detail="8 pages · 31 chunks"
      />
      <SourceRow
        variant="list"
        status="ready"
        icon={<EnvelopeSimple aria-hidden />}
        name="Investor threads"
        detail="45 chunks · 3 threads"
      />
    </KnowledgeBasePanel>
  );
}
