import { TextareaField } from "@horon-ai/react";

export default function TextareaFieldBasic() {
  return (
    <div className="flex w-full max-w-90 flex-col gap-4">
      <TextareaField
        label="Instructions"
        hint="Optional"
        placeholder="Tell the bot how you like your inbox handled"
        description="The bot reads this before every task."
      />
      <TextareaField label="Tone of voice" defaultValue="Short, plain, no emoji." description="Applies to every reply." />
    </div>
  );
}
