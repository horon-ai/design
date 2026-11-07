import { PlanStep } from "@horon-ai/react";

export default function PlanStepRail() {
  return (
    <div className="flex w-full max-w-140 flex-col">
      <PlanStep
        status="done"
        index={1}
        title="Pull Q3 revenue and ARR"
        description="Monthly revenue, ARR and net retention"
        tool="stripe.query"
        elapsed="1.3s"
      />
      <PlanStep
        status="running"
        index={2}
        title="Build the metrics slide"
        description="Chart revenue against plan"
        tool="slides.update"
        elapsed="0.4s"
      />
      <PlanStep
        status="pending"
        index={3}
        title="Write the summary paragraph"
        description="Three sentences for the cover page"
        tool="docs.write"
      />
      <PlanStep status="pending" index={4} title="Send the draft to Maya for review" tool="gmail.draft" last />
    </div>
  );
}
