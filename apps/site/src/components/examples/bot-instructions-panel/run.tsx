import { BotInstructionsPanel } from "@horon-ai/react";
import { useState } from "react";

const scenarios = ["Busy Monday", "Quiet day", "Travel day"];

export default function BotInstructionsPanelRun() {
  const [output, setOutput] = useState<string | undefined>();
  return (
    <div className="flex w-full justify-center">
      <BotInstructionsPanel
        title="Morning brief"
        bot={{ initial: "C", name: "Chief of staff" }}
        instructions={[
          ["You write the morning brief for", { variable: "user_name" }, "before 8 AM."],
          ["Lead with what needs a yes today. Keep it under 150 words."],
        ]}
        variables={[{ name: "user_name", value: "Alpox" }]}
        scenarios={scenarios}
        defaultScenario="Quiet day"
        output={output}
        onRun={(scenario) => setOutput(`Ran ${scenario ?? "the prompt"}: the brief appears here.`)}
      />
    </div>
  );
}
