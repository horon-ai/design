import { ChoiceCard, RadioGroup } from "@horon-ai/react";

export default function ChoiceCardDemo() {
  return (
    <RadioGroup aria-label="Plan" defaultValue="auto" className="flex-row flex-wrap justify-center gap-4">
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
        description="Nothing leaves until you send it yourself."
        disabled
      />
    </RadioGroup>
  );
}
