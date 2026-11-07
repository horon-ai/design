import { BotInstructionsPanel } from "@horon-ai/react";

export default function BotInstructionsPanelVersion() {
  return (
    <div className="flex w-full justify-center">
      <BotInstructionsPanel
        version="v4"
        versionStatus="Live"
        bot={{ initial: "C", name: "Chief of staff" }}
        instructions={[["Draft the weekly update from", { variable: "notes" }, "and leave it unsent."]]}
        onVersionClick={() => undefined}
        onBotClick={() => undefined}
        tokenCount={112}
      />
    </div>
  );
}
