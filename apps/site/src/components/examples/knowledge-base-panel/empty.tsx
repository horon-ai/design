import { KnowledgeBasePanel } from "@horon-ai/react";

export default function KnowledgeBaseEmpty() {
  return (
    <KnowledgeBasePanel
      className="w-full max-w-200"
      title="Company knowledge"
      meta="0 sources · Nothing indexed yet"
      tabs={[{ id: "sources", label: "Sources", count: 0 }]}
      dropTitle="Drop files here, or browse"
      dropHint="PDF, DOCX, Markdown or TXT"
      onSettings={() => undefined}
      onAddSource={() => undefined}
      onFiles={() => undefined}
    />
  );
}
