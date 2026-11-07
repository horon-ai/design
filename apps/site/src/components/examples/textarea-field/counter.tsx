import { TextareaField } from "@horon-ai/react";

export default function TextareaFieldCounter() {
  return (
    <div className="flex w-full max-w-90 flex-col gap-4">
      <TextareaField
        label="Instructions"
        placeholder="Reply with one sentence and cite a source."
        description="Keep it short; the bot adds it to every prompt."
        maxLength={280}
      />
      <TextareaField
        label="Escalation note"
        defaultValue="Send anything from my manager to Slack."
        maxLength={120}
      />
    </div>
  );
}
