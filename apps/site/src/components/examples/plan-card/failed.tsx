import { PlanCard, PlanStep } from "@horon-ai/react";
import { useState } from "react";

export default function PlanCardFailed() {
  const [failed, setFailed] = useState(true);
  return (
    <PlanCard
      label="Plan · 3 steps"
      title="Reply to the investor thread"
      status={failed ? "failed" : "running"}
      statusLabel={failed ? "Stopped · step 2 failed" : "Running · 2 of 3"}
    >
      <PlanStep status="done" index={1} title="Read the thread" tool="gmail.read" elapsed="0.6s" />
      <PlanStep
        status={failed ? "failed" : "running"}
        index={2}
        title="Draft a reply"
        description="Two paragraphs, no numbers"
        tool="gmail.draft"
        error={failed ? "Gmail access expired" : undefined}
        onRetry={failed ? () => setFailed(false) : undefined}
      />
      <PlanStep status="pending" index={3} title="Send after your yes" tool="gmail.send" last />
    </PlanCard>
  );
}
