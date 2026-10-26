import { Radio, RadioGroup } from "@horon-ai/react";

export default function RadioGroupDemo() {
  return (
    <RadioGroup aria-label="Report to" defaultValue="email">
      <Radio value="email" label="Email" />
      <Radio value="slack" label="Slack" />
      <Radio value="none" label="Don't report" disabled />
    </RadioGroup>
  );
}
