import { ChoiceCard, RadioGroup } from "@horon-ai/react";
import { useState } from "react";

export default function ChoiceCardControlled() {
  const [plan, setPlan] = useState("solo");

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <RadioGroup
        aria-label="Plan"
        value={plan}
        onValueChange={(next) => {
          if (typeof next === "string") setPlan(next);
        }}
        className="flex-row flex-wrap items-stretch justify-center gap-4"
      >
        <ChoiceCard value="solo" title="Solo" description="One workspace for yourself." />
        <ChoiceCard value="team" title="Team" description="Shared bots, memory and billing." />
      </RadioGroup>
      <p className="text-caption text-text-secondary">Selected: {plan}</p>
    </div>
  );
}
