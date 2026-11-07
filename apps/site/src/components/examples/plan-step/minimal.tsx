import { PlanStep } from "@horon-ai/react";

export default function PlanStepTitles() {
  return (
    <div className="flex w-full max-w-140 flex-col">
      <PlanStep status="done" index={1} title="Collect sources" elapsed="2s" />
      <PlanStep status="done" index={2} title="Draft the update" description="Four sections, 320 words" last />
    </div>
  );
}
