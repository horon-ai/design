import { PlanCard, PlanStep } from "@horon-ai/react";
import { useState } from "react";

export default function PlanCardDemo() {
  const [failed, setFailed] = useState(true);

  return (
    <div className="flex w-full max-w-180 flex-col gap-6">
      <PlanCard
        label="Plan · 5 steps"
        title="Prepare the Q3 board update"
        status={failed ? "failed" : "running"}
        statusLabel={failed ? "Stopped · step 4 failed" : "Running · 4 of 5"}
        elapsed={failed ? undefined : "0.8s"}
      >
        <PlanStep
          status="done"
          index={1}
          title="Pull Q3 revenue and ARR"
          description="Monthly revenue, ARR and net retention"
          tool="stripe.query"
          elapsed="1.3s"
        />
        <PlanStep
          status="done"
          index={2}
          title="Summarize product launches"
          description="Shipped projects and adoption"
          tool="linear.search"
          elapsed="1.1s"
        />
        <PlanStep
          status="done"
          index={3}
          title="Draft the board memo"
          description="One page, wins, risks and asks"
          tool="docs.write"
          elapsed="1.2s"
        />
        <PlanStep
          status={failed ? "failed" : "running"}
          index={4}
          title="Build the KPI slides"
          description="Six charts in the board template"
          tool="slides.create"
          error="Slides API timed out after 30s"
          onRetry={() => setFailed(false)}
        />
        <PlanStep
          status="pending"
          index={5}
          title="Send the draft to Maya for review"
          tool="gmail.draft"
          last
        />
      </PlanCard>
      <PlanCard label="Plan · 2 steps" title="Reply to the investor thread">
        <PlanStep status="done" index={1} title="Read the thread" tool="gmail.read" elapsed="0.6s" />
        <PlanStep status="pending" index={2} title="Draft a reply" tool="gmail.draft" last />
      </PlanCard>
    </div>
  );
}
