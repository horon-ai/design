import { ChoiceCard, RadioGroup } from "@horon-ai/react";

export default function ChoiceCardThumbnail() {
  return (
    <RadioGroup aria-label="Plan" defaultValue="auto" className="flex w-full max-w-63 flex-col gap-3">
      <ChoiceCard
        value="auto"
        title="Automatic"
        description="Drafts and sends within your rules."
        badge="Recommended"
      />
      <ChoiceCard value="review" title="Review first" description="Every draft waits for approval." />
    </RadioGroup>
  );
}
