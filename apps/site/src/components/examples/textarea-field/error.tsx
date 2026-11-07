import { TextareaField } from "@horon-ai/react";

export default function TextareaFieldError() {
  return (
    <div className="flex w-full max-w-90 flex-col gap-4">
      <TextareaField
        label="Instructions"
        hint="Required"
        defaultValue="Skip newsletters."
        error="Add at least 40 characters so the bot has something to act on."
        maxLength={280}
      />
      <TextareaField
        label="Tone of voice"
        description="The help line stays while this field is valid."
      />
    </div>
  );
}
