import { PlanStep } from "../../src/components/plan-step";

/** Three steps in a row: finished with its timing, running with a spinner, and pending. */
export default function PlanStepDemo() {
  return (
    <view className="flex w-full flex-col p-4">
      <view className="flex w-full max-w-[560px] flex-col">
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
      </view>
      <view className="mt-6 flex w-full max-w-[560px] flex-col">
        <PlanStep
          status="failed"
          index={2}
          title="Build the metrics slide"
          description="Chart revenue against plan"
          tool="slides.update"
          elapsed="6.1s"
          error="slides.update timed out after 30s"
          onRetry={() => undefined}
        />
        <PlanStep status="pending" index={3} title="Send the draft to Maya for review" last />
      </view>
    </view>
  );
}
