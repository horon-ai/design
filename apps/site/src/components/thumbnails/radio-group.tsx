import { Radio, RadioGroup } from "@horon-ai/react";

export default function RadioGroupThumbnail() {
  return (
    <RadioGroup aria-label="Where reports go" defaultValue="email" className="gap-4">
      <Radio value="email" label="Email" />
      <Radio value="slack" label="Slack" />
      <Radio value="none" label="Don’t send" />
    </RadioGroup>
  );
}
