import { PlanStep } from "@horon-ai/react";

export default function PlanStepFailed() {
  return (
    <div className="flex w-full max-w-140 flex-col">
      <PlanStep status="done" index={1} title="Read the board template" tool="slides.read" elapsed="0.8s" />
      <PlanStep
        status="failed"
        index={2}
        title="Build the KPI slides"
        description="Six charts in the board template"
        tool="slides.create"
        error="Slides API timed out after 30s"
        onRetry={() => undefined}
      />
      <PlanStep status="pending" index={3} title="Send the draft to Maya for review" tool="gmail.draft" last />
    </div>
  );
}
