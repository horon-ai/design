import { PlanCard, PlanStep } from "@horon-ai/react";

export default function PlanCardNoFooter() {
  return (
    <PlanCard label="Plan · 2 steps" title="Reply to the investor thread">
      <PlanStep status="done" index={1} title="Read the thread" tool="gmail.read" elapsed="0.6s" />
      <PlanStep status="pending" index={2} title="Draft a reply" tool="gmail.draft" last />
    </PlanCard>
  );
}
