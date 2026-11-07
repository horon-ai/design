import { Textarea } from "@horon-ai/react";

export default function TextareaStates() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Textarea
        className="w-full max-w-80"
        invalid
        defaultValue="Skip newsletters"
        aria-label="Instructions, invalid"
        aria-describedby="textarea-states-error"
      />
      <p id="textarea-states-error" className="text-caption text-text-danger">
        Say what the bot should do instead of just skipping.
      </p>
      <Textarea className="w-full max-w-80" disabled placeholder="Locked while the bot runs" aria-label="Disabled textarea" />
      <Textarea
        className="w-full max-w-80"
        rows={5}
        placeholder="Five rows at the medium rung"
        aria-label="Five row textarea"
      />
    </div>
  );
}
