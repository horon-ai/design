import { SourceRow } from "@horon-ai/react";
import { FileText, Globe } from "@phosphor-icons/react";

export default function SourceRowList() {
  return (
    <div className="flex w-full max-w-190 flex-col">
      <SourceRow
        variant="list"
        status="ready"
        icon={<FileText aria-hidden />}
        name="Pricing FAQ.pdf"
        detail="8 pages · 31 chunks · Uploaded Oct 9"
      />
      <SourceRow
        variant="list"
        status="indexing"
        icon={<Globe aria-hidden />}
        name="docs.horon.ai"
        detail="Embedding · 90 of 296 chunks"
        progress={30}
      />
      <SourceRow
        variant="list"
        status="ready"
        icon={<FileText aria-hidden />}
        name="Support macros.md"
        detail="6 chunks · Uploaded Oct 2"
      />
    </div>
  );
}
