import { ChoiceCard, RadioGroup } from "@horon-ai/react";

export default function ChoiceCardWithoutDescription() {
  return (
    <RadioGroup
      aria-label="Output format"
      defaultValue="markdown"
      className="flex-row flex-wrap items-start justify-center gap-3"
    >
      <ChoiceCard value="markdown" title="Markdown" />
      <ChoiceCard value="plain" title="Plain text" />
      <ChoiceCard value="pdf" title="PDF" />
    </RadioGroup>
  );
}
