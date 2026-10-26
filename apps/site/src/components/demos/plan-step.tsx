import { PlanStep } from "@horon-ai/react";

export default function PlanStepDemo() {
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
        title="Send the draft to Maya for review"
        description="Draft for review in Gmail"
        tool="gmail.draft"
        last
      />
    </div>
  );
}
