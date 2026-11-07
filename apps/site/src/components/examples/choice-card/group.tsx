import { ChoiceCard, RadioGroup } from "@horon-ai/react";

export default function ChoiceCardGroup() {
  return (
    <RadioGroup
      aria-label="Plan"
      defaultValue="auto"
      className="flex-row flex-wrap items-stretch justify-center gap-4"
    >
      <ChoiceCard
        value="auto"
        title="Automatic"
        description="Horon drafts and sends within your rules."
        badge="Recommended"
      />
      <ChoiceCard value="review" title="Review first" description="Every draft waits for your approval." />
      <ChoiceCard
        value="manual"
        title="Manual only"
        description="Available once a mailbox is connected."
        disabled
      />
    </RadioGroup>
  );
}
