import { Radio, RadioGroup } from "@horon-ai/react";

export default function RadioGroupSizes() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-8">
      <RadioGroup aria-label="Priority, small" size="sm" defaultValue="low">
        <Radio value="low" label="Low" />
        <Radio value="high" label="High" />
      </RadioGroup>
      <RadioGroup aria-label="Priority, medium" size="md" defaultValue="low">
        <Radio value="low" label="Low" />
        <Radio value="high" label="High" />
      </RadioGroup>
      <RadioGroup aria-label="Priority, large" size="lg" defaultValue="low">
        <Radio value="low" label="Low" />
        <Radio value="high" label="High" />
      </RadioGroup>
    </div>
  );
}
