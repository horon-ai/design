import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Composer, HoronText } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function ComposerDemo() {
  const [sent, setSent] = useState<string[]>([]);
  const [value, setValue] = useState("Draft kept by the parent");
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Uncontrolled · type, then send
      </HoronText>
      <Composer
        onAttach={() => setSent((list) => [...list, "attached a file"])}
        onVoice={() => setSent((list) => [...list, "opened dictation"])}
        onSubmit={(text) => setSent((list) => [...list, text])}
      />
      <HoronText variant="label-sm" tone="text-secondary">
        Sizes · sm, md, lg
      </HoronText>
      <Composer size="sm" placeholder="Small" onSubmit={(text) => setSent((list) => [...list, text])} />
      <Composer size="md" placeholder="Medium" onSubmit={(text) => setSent((list) => [...list, text])} />
      <Composer size="lg" placeholder="Large" onSubmit={(text) => setSent((list) => [...list, text])} />
      <HoronText variant="label-sm" tone="text-secondary">
        Controlled · the parent owns the text
      </HoronText>
      <Composer value={value} onValueChange={setValue} onSubmit={(text) => setSent((list) => [...list, text])} />
      <HoronText variant="label-sm" tone="text-secondary">
        Disabled
      </HoronText>
      <Composer placeholder="Send is unavailable" disabled />
      <Backdrop>
        <Composer
          surface="glass"
          placeholder="Glass field"
          onSubmit={(text) => setSent((list) => [...list, text])}
        />
      </Backdrop>
      <HoronText variant="label-sm" tone="text-secondary">
        {sent.length === 0 ? "nothing sent yet" : sent.join(" · ")}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
