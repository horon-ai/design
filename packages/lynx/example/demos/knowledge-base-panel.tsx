import { useState } from "@lynx-js/react";

import { KnowledgeBasePanel } from "../../src/components/knowledge-base-panel";
import { SourceRow } from "../../src/components/source-row";
import { Icon } from "../../src/icons";

/** The knowledge-base panel over three sources; the settings and Add source buttons report their taps. */
export default function KnowledgeBasePanelDemo() {
  const [note, setNote] = useState("3 sources · 286 chunks · Used by 3 bots");
  return (
    <view className="flex w-full flex-row justify-center p-4">
      <view className="flex w-full max-w-[800px] flex-col">
        <KnowledgeBasePanel
          title="Company knowledge"
          meta={note}
          tabs={[
            { id: "sources", label: "Sources", count: 3 },
            { id: "retrieval", label: "Test retrieval" },
          ]}
          indexing={1}
          onSettings={() => setNote("Settings open")}
          onAddSource={() => setNote("Pick a source to connect")}
          onFiles={() => setNote("Hand the picked files to the host")}
        >
          <SourceRow
            variant="list"
            status="ready"
            icon={<Icon name="FileText" />}
            name="Refund and cancellation policy.pdf"
            detail="12 pages · 45 chunks · Uploaded Oct 14"
          />
          <SourceRow
            variant="list"
            status="failed"
            icon={<Icon name="EnvelopeSimple" />}
            name="Investor threads"
            detail="Embedding timed out after 41 of 68 chunks"
            onRetry={() => setNote("Retrying Investor threads")}
          />
          <SourceRow
            variant="list"
            status="indexing"
            icon={<Icon name="Globe" />}
            name="help.horon.ai"
            detail="Embedding · 140 of 296 chunks"
            progress={62}
          />
        </KnowledgeBasePanel>
      </view>
    </view>
  );
}
