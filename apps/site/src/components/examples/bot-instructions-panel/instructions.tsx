import { BotInstructionsPanel } from "@horon-ai/react";

export default function BotInstructionsPanelInstructions() {
  return (
    <div className="flex w-full justify-center">
      <BotInstructionsPanel
        title="Morning brief"
        bot={{ initial: "C", name: "Chief of staff" }}
        instructions={[
          ["You write the morning brief for", { variable: "user_name" }, "before 8 AM."],
          ["Lead with what needs a yes today. Keep it under 150 words."],
          ["- Use", { variable: "calendar", tone: "brand" }, "to list today’s meetings, earliest first."],
          ["- Pull the 3 most urgent threads from", { variable: "inbox", tone: "neutral" }, "."],
        ]}
      />
    </div>
  );
}
