import { ChoiceCard, RadioGroup } from "@horon-ai/react";

export default function ChoiceCardBadgeTones() {
  return (
    <RadioGroup
      aria-label="Workspace"
      defaultValue="team"
      className="flex-row flex-wrap items-stretch justify-center gap-4"
    >
      <ChoiceCard
        value="team"
        title="Team"
        description="Shared bots, memory and billing."
        badge="Recommended"
      />
      <ChoiceCard
        value="current"
        title="Current plan"
        description="What this workspace runs on today."
        badge="Active"
        badgeTone="neutral"
      />
    </RadioGroup>
  );
}
