import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ChoiceCard, HoronText, RadioGroup } from "@horon-ai/expo";

/** The default card, both badge tones, a controlled group and the disabled card. */
export default function ChoiceCardDemo() {
  const [plan, setPlan] = useState("team");

  return (
    <View style={styles.stack}>
      <RadioGroup aria-label="Workspace plan" value={plan} onValueChange={setPlan} style={styles.group}>
        <ChoiceCard value="solo" title="Solo" description="One workspace for yourself." />
        <ChoiceCard
          value="team"
          title="Team"
          description="Shared bots, memory and billing."
          badge="Recommended"
        />
        <ChoiceCard
          value="enterprise"
          title="Enterprise"
          description="Single sign-on, audit log and support."
          badge="Neutral"
          badgeTone="neutral"
        />
        <ChoiceCard
          value="legacy"
          title="Legacy"
          description="No longer offered."
          disabled
        />
      </RadioGroup>
      <RadioGroup aria-label="Lone card" defaultValue="only" style={styles.group}>
        <ChoiceCard value="only" title="Standalone" description="A card picked outside a larger set." />
        <ChoiceCard value="other" title="Other" description="Nothing selected here." />
      </RadioGroup>
      <HoronText tone="text-secondary">plan {plan}</HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  group: { gap: 12 },
});
