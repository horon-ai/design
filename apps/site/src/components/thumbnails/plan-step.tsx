import { PlanStep } from "@horon-ai/react";

export default function PlanStepThumbnail() {
  return (
    <div className="flex w-80 flex-col">
      <PlanStep
        status="done"
        index={1}
        title="Pull Q3 revenue and ARR"
        tool="stripe.query"
        elapsed="1.3s"
      />
      <PlanStep status="running" index={2} title="Build the metrics slide" tool="slides.update" elapsed="0.4s" />
      <PlanStep status="pending" index={3} title="Send the draft to Maya" last />
    </div>
  );
}
