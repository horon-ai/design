import { useState } from "@lynx-js/react";

import { PlanCard } from "../../src/components/plan-card";
import { Icon } from "../../src/icons";

/**
 * A demo-only stand-in for the `PlanStep` rows: that component is ported in
 * another lane, so this file draws plain rows with the same shape (index, title,
 * caption, elapsed) instead of importing a slug it does not own.
 */
function Step({
  index,
  title,
  detail,
  tool,
  last,
}: {
  index: number;
  title: string;
  detail?: string;
  tool?: string;
  last?: boolean;
}) {
  return (
    <view className="flex w-full flex-col">
      <view className="flex w-full flex-row items-start gap-3 py-2.5">
        <view className="flex size-5 shrink-0 flex-row items-center justify-center rounded-full bg-bg-subtle">
          <text className="text-caption text-text-secondary">{index}</text>
        </view>
        <view className="flex min-w-0 flex-1 flex-col gap-0.5">
          <text className="break-all text-label-md text-text-primary">{title}</text>
          {detail ? <text className="break-all text-caption text-text-secondary">{detail}</text> : null}
          {tool ? <text className="font-mono text-caption text-text-secondary">{tool}</text> : null}
        </view>
      </view>
      {last ? null : <view className="h-px w-full bg-overlay-ink-8" />}
    </view>
  );
}

/** The plan card with a switching footer and a plan that never runs. */
export default function PlanCardDemo() {
  const [failed, setFailed] = useState(true);

  return (
    <view className="flex w-full max-w-[720px] flex-col gap-6">
      <PlanCard
        label="Plan · 5 steps"
        title="Prepare the Q3 board update"
        status={failed ? "failed" : "running"}
        statusLabel={failed ? "Stopped · step 4 failed" : "Running · 4 of 5"}
        elapsed={failed ? undefined : "0.8s"}
      >
        <Step
          index={1}
          title="Pull Q3 revenue and ARR"
          detail="Monthly revenue, ARR and net retention"
          tool="stripe.query"
        />
        <Step
          index={2}
          title="Summarize product launches"
          detail="Shipped projects and adoption"
          tool="linear.search"
        />
        <Step index={3} title="Draft the board memo" detail="One page, wins, risks and asks" tool="docs.write" />
        <Step index={4} title="Build the KPI slides" detail="Six charts in the board template" tool="slides.create" />
        <Step index={5} title="Send the draft to Maya for review" tool="gmail.draft" last />
      </PlanCard>
      <view className="flex flex-row items-center gap-2">
        <view
          className="motion-press flex flex-row items-center gap-1.5 rounded-full border border-border-default bg-bg-surface px-3 py-1.5"
          bindtap={() => setFailed((value) => !value)}
          accessibility-element
          accessibility-traits="button"
          accessibility-role-description="button"
          accessibility-label={failed ? "Retry the plan" : "Fail the plan"}
        >
          <Icon name="ListChecks" size={14} color="text-secondary" />
          <text className="text-label-sm text-text-primary">{failed ? "Retry" : "Fail"}</text>
        </view>
      </view>
      <PlanCard label="Plan · 2 steps" title="Reply to the investor thread">
        <Step index={1} title="Read the thread" tool="gmail.read" />
        <Step index={2} title="Draft a reply" tool="gmail.draft" last />
      </PlanCard>
    </view>
  );
}
