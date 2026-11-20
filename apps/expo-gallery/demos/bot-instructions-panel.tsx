import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BotInstructionsPanel, HoronText, type InstructionPart } from "@horon-ai/expo";

const instructions: InstructionPart[][] = [
  ["Summarise ", { variable: "sheet", tone: "sky" }, " for ", { variable: "audience", tone: "brand" }],
  ["Keep it to five bullets and note any ", { variable: "risk", tone: "neutral" }, "."],
];

/** The full panel with version pill, variable chips, scenarios and a run log, plus a bare one. */
export default function BotInstructionsPanelDemo() {
  const [runs, setRuns] = useState<string[]>([]);
  return (
    <View style={styles.stack}>
      <BotInstructionsPanel
        title="Instructions"
        version="v4"
        versionStatus="Live"
        bot={{ initial: "R", name: "Researcher" }}
        instructions={instructions}
        example="Summarised the Q3 sheet for the board in five bullets."
        tokenCount={128}
        variables={[
          { name: "sheet", tone: "sky", value: "Q3 metrics" },
          { name: "audience", tone: "brand", value: "Board" },
          { name: "risk", tone: "neutral", value: "Churn in SMB" },
        ]}
        scenarios={["Weekly digest", "Board update"]}
        onRun={(scenario) => setRuns((previous) => [`Ran ${scenario ?? "the prompt"}`, ...previous].slice(0, 3))}
        output={runs[0]}
        onVersionClick={() => undefined}
        onBotClick={() => undefined}
      />
      {runs.length > 0 ? (
        <HoronText variant="caption" tone="text-secondary">
          {runs.join(" · ")}
        </HoronText>
      ) : null}
      <BotInstructionsPanel
        bot={{ initial: "E", name: "Editor" }}
        instructions={[["Tighten the last paragraph without losing the numbers."]]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 20 },
});
