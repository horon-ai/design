import { BotInstructionsPanel } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function BotInstructionsPanelDemo() {
  return (
    <Backdrop>
      <BotInstructionsPanel
        title="Morning brief"
        version="v4"
        versionStatus="Live"
        bot={{ initial: "C", name: "Chief of staff" }}
        tokenCount={112}
        instructions={[
          ["You write the morning brief for", { variable: "user_name" }, "before 8 AM."],
          ["Lead with what needs a yes today. Keep it under 150 words."],
          ["- Use", { variable: "calendar", tone: "brand" }, "to list today’s meetings, earliest first."],
          ["- Pull the 3 most urgent threads from", { variable: "inbox", tone: "neutral" }, "."],
          ["- Never send anything; drafts only."],
        ]}
        example={"Good morning Alpox. Two things need a yes today: the Fjord invoice and the 3 PM reschedule."}
        variables={[
          { name: "user_name", value: "Alpox" },
          { name: "calendar", tone: "brand", value: "Google Calendar" },
          { name: "inbox", tone: "neutral", value: "Gmail · last 12h" },
        ]}
        scenarios={["Busy Monday", "Quiet day", "Travel day"]}
        output="Run Busy Monday to see the brief here."
      />
    </Backdrop>
  );
}
