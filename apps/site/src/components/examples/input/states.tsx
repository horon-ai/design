import { Input } from "@horon-ai/react";

export default function InputStates() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Input className="w-full max-w-72" invalid defaultValue="Inbox Manager" aria-label="Bot name, invalid" />
      <Input className="w-full max-w-72" disabled placeholder="Unavailable" aria-label="Disabled input" />
      <Input className="w-full max-w-72" readOnly defaultValue="chief-of-staff@horon.ai" aria-label="Read only email" />
      <Input
        className="w-full max-w-72"
        surface="glass"
        invalid
        defaultValue="Inbox Manager"
        aria-label="Invalid glass input"
      />
    </div>
  );
}
