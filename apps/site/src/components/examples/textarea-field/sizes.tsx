import { TextareaField } from "@horon-ai/react";

export default function TextareaFieldSizes() {
  return (
    <div className="flex w-full max-w-90 flex-col gap-4">
      <TextareaField size="sm" label="Small" placeholder="88px tall" maxLength={120} />
      <TextareaField size="md" label="Medium" placeholder="112px tall" maxLength={120} />
      <TextareaField size="lg" label="Large" placeholder="136px tall" maxLength={120} />
    </div>
  );
}
