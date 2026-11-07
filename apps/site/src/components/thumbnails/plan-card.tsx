import { PlanCard, PlanStep } from "@horon-ai/react";

export default function PlanCardThumbnail() {
  return (
    <div className="w-84 [&_h3]:m-0! [&_h3]:text-label-lg!">
      <PlanCard status="running" title="Prepare the Q3 board update" statusLabel="Running · 2 of 5" elapsed="0.8s">
        <PlanStep status="done" index={1} title="Pull Q3 revenue and ARR" elapsed="1.3s" />
        <PlanStep status="running" index={2} title="Build the KPI slides" elapsed="0.4s" last />
      </PlanCard>
    </div>
  );
}
