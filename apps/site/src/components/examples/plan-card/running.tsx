import { PlanCard, PlanStep } from "@horon-ai/react";

export default function PlanCardRunning() {
  return (
    <PlanCard
      label="Plan · 5 steps"
      title="Prepare the Q3 board update"
      status="running"
      statusLabel="Running · 4 of 5"
      elapsed="0.8s"
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
        status="running"
        index={3}
        title="Draft the board memo"
        description="One page, wins, risks and asks"
        tool="docs.write"
        elapsed="0.8s"
      />
      <PlanStep status="pending" index={4} title="Build the KPI slides" tool="slides.create" />
      <PlanStep status="pending" index={5} title="Send the draft to Maya for review" tool="gmail.draft" last />
    </PlanCard>
  );
}
