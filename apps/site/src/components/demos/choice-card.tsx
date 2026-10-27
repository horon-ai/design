import { ChoiceCard, RadioGroup } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function ChoiceCardDemo() {
  return (
    <Backdrop>
      <RadioGroup aria-label="Plan" defaultValue="auto" className="flex-row flex-wrap gap-4">
        <ChoiceCard value="auto" title="Automatic" description="Horon drafts and sends within your rules." />
        <ChoiceCard value="review" title="Review first" description="Every draft waits for your approval." />
      </RadioGroup>
    </Backdrop>
  );
}
