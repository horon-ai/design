import { Composer } from "@horon-ai/react";

export default function ComposerBasic() {
  return (
    <div className="flex w-full justify-center">
      <Composer
        className="w-full max-w-97.5"
        placeholder="Ask Chief of staff"
        onAttach={() => undefined}
        onVoice={() => undefined}
        onSubmit={() => undefined}
      />
    </div>
  );
}
