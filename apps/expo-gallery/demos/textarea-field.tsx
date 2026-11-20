import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HoronText, TextareaField } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function TextareaFieldDemo() {
  const [instructions, setInstructions] = useState("Be concise and cite sources.");
  return (
    <View style={styles.stack}>
      <HoronText variant="label-md">Label, hint, description and counter</HoronText>
      <TextareaField
        label="Instructions"
        hint="Optional"
        description="Tell the bot how to answer."
        maxLength={280}
        value={instructions}
        onChange={setInstructions}
      />

      <HoronText variant="label-md">Sizes</HoronText>
      <TextareaField label="Small" size="sm" maxLength={120} description="88pt box." />
      <TextareaField label="Medium" size="md" maxLength={280} description="112pt box, the default." />
      <TextareaField label="Large" size="lg" maxLength={480} description="136pt box." />

      <HoronText variant="label-md">Error and disabled</HoronText>
      <TextareaField
        label="Instructions"
        hint="Required"
        maxLength={280}
        error="Give the bot at least one sentence."
        defaultValue="Too short"
      />
      <TextareaField label="Locked" disabled description="Disabled dims the whole field." defaultValue="Read only." />
      <TextareaField label="Read only" readOnly description="Selectable, not editable." defaultValue="Kept as is." />

      <HoronText variant="label-md">Surfaces</HoronText>
      <TextareaField label="On the page" surface="solid-on-page" description="Sits directly on bg-default." />
      <Backdrop>
        <TextareaField label="Glass" surface="glass" description="The veil field over imagery." />
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
