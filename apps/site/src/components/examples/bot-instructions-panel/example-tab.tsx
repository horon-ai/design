import { BotInstructionsPanel } from "@horon-ai/react";

export default function BotInstructionsPanelExampleTab() {
  return (
    <div className="flex w-full justify-center">
      <BotInstructionsPanel
        title="Morning brief"
        version="v4"
        bot={{ initial: "C", name: "Chief of staff" }}
        tokenCount={112}
        instructions={[["You write the morning brief before 8 AM and keep it under 150 words."]]}
        example="Good morning Alpox. Two things need a yes today: the Fjord invoice and the 3 PM reschedule."
      />
    </div>
  );
}
