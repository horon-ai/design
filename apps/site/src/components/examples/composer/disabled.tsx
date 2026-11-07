import { Composer } from "@horon-ai/react";

export default function ComposerDisabled() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Composer className="w-full max-w-97.5" placeholder="Ask Chief of staff" />
      <Composer
        className="w-full max-w-97.5"
        placeholder="Asking anything"
        defaultValue="Draft an answer to the support thread"
        disabled
      />
    </div>
  );
}
