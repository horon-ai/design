import { useState } from "@lynx-js/react";

import { Button } from "../../src/components/button";
import { SourceRow } from "../../src/components/source-row";
import { Icon } from "../../src/icons";

/** Indexing in place: the button walks the progress and the active stage bar follows it. */
function InteractiveIndexing() {
  const [progress, setProgress] = useState(42);
  return (
    <view className="flex w-full flex-col gap-2">
      <SourceRow
        status="indexing"
        icon={<Icon name="Globe" />}
        name="wiki.horon.ai"
        detail={`Embedding · ${Math.round((progress * 296) / 100)} of 296 chunks`}
        progress={progress}
      />
      <view>
        <Button size="sm" variant="solid" onClick={() => setProgress((value) => Math.min(100, value + 17))}>
          Advance progress
        </Button>
      </view>
    </view>
  );
}

/** Ready, indexing, failed and the list variant, mirroring the site demo. */
export default function SourceRowDemo() {
  return (
    <view className="flex w-full flex-col p-4">
      <view className="flex w-full max-w-[760px] flex-col gap-2">
        <InteractiveIndexing />
        <SourceRow
          status="ready"
          icon={<Icon name="FileText" />}
          name="Refund and cancellation policy.pdf"
          detail="12 pages · 45 chunks · Uploaded Oct 14"
        />
        <SourceRow
          status="indexing"
          icon={<Icon name="Globe" />}
          name="help.horon.ai"
          detail="Embedding · 140 of 296 chunks"
          progress={62}
        />
        <SourceRow
          status="failed"
          icon={<Icon name="EnvelopeSimple" />}
          name="Investor threads"
          detail="Embedding timed out after 41 of 68 chunks"
          onRetry={() => undefined}
        />
        <view className="flex flex-col">
          <SourceRow
            variant="list"
            status="ready"
            icon={<Icon name="FileText" />}
            name="Pricing FAQ.pdf"
            detail="8 pages · 31 chunks · Uploaded Oct 9"
          />
          <SourceRow
            variant="list"
            status="indexing"
            icon={<Icon name="Globe" />}
            name="docs.horon.ai"
            detail="Embedding · 90 of 296 chunks"
            progress={30}
          />
        </view>
      </view>
    </view>
  );
}
