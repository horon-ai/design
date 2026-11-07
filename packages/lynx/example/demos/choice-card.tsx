import { useState } from "@lynx-js/react";

import { ChoiceCard } from "../../src/components/choice-card";

/** One picked card at a time: the caller owns the value, the same way a radio group did on React. */
export default function ChoiceCardDemo() {
  const [plan, setPlan] = useState("auto");

  return (
    <view className="flex w-full flex-col p-4">
      <view className="flex w-full flex-row flex-wrap items-stretch justify-center gap-4">
        <ChoiceCard
          value="auto"
          title="Automatic"
          description="Horon drafts and sends within your rules."
          badge="Recommended"
          checked={plan === "auto"}
          onCheckedChange={() => setPlan("auto")}
        />
        <ChoiceCard
          value="review"
          title="Review first"
          description="Every draft waits for your approval."
          checked={plan === "review"}
          onCheckedChange={() => setPlan("review")}
        />
        <ChoiceCard
          value="manual"
          title="Manual only"
          description="Nothing leaves until you send it yourself."
          disabled
        />
      </view>
      <view className="mt-6 flex w-full flex-row flex-wrap items-center justify-center gap-4">
        <ChoiceCard value="neutral" title="Neutral badge" description="A 6% ink pill." badge="Optional" badgeTone="neutral" />
        <ChoiceCard value="dot" title="Uncontrolled" description="Keeps its own state." defaultChecked={false} />
      </view>
      <text className="mt-4 text-caption text-text-secondary">{`Picked: ${plan}`}</text>
    </view>
  );
}
