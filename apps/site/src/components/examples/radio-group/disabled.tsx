import { Radio, RadioGroup } from "@horon-ai/react";

export default function RadioGroupDisabled() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-8">
      <RadioGroup aria-label="Model" defaultValue="fast" disabled>
        <Radio value="fast" label="Fast" />
        <Radio value="thorough" label="Thorough" />
      </RadioGroup>
      <RadioGroup aria-label="Model with one unavailable option" defaultValue="fast">
        <Radio value="fast" label="Fast" />
        <Radio value="thorough" label="Thorough" />
        <Radio value="custom" label="Custom model" disabled />
      </RadioGroup>
    </div>
  );
}
