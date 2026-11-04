import { Radio, RadioGroup } from "@horon-ai/react";

export default function RadioGroupDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-8">
        <RadioGroup aria-label="Report to, small" size="sm" defaultValue="email">
          <Radio value="email" label="Small" />
          <Radio value="slack" label="Slack" />
        </RadioGroup>
        <RadioGroup aria-label="Report to" defaultValue="email">
          <Radio value="email" label="Medium" />
          <Radio value="slack" label="Slack" />
        </RadioGroup>
        <RadioGroup aria-label="Report to, large" size="lg" defaultValue="email">
          <Radio value="email" label="Large" />
          <Radio value="slack" label="Slack" />
        </RadioGroup>
      </div>
      <RadioGroup aria-label="Report to" defaultValue="email">
        <Radio value="email" label="Email" />
        <Radio value="slack" label="Slack" />
        <Radio value="none" label="Don't report" disabled />
      </RadioGroup>
    </div>
  );
}
