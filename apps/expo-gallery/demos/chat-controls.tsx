import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HoronText, JumpToLatest, NewMessagesPill, VoiceInput } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function ChatControlsDemo() {
  const [jumps, setJumps] = useState(0);
  const jump = () => setJumps((count) => count + 1);
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Jump to latest · solid and glass
      </HoronText>
      <View style={styles.row}>
        <JumpToLatest onPress={jump} />
        <JumpToLatest aria-label="Scroll to the newest message" onPress={jump} />
        <JumpToLatest disabled onPress={jump} />
      </View>
      <Backdrop>
        <View style={styles.row}>
          <JumpToLatest surface="glass" onPress={jump} />
          <JumpToLatest surface="glass" disabled onPress={jump} />
        </View>
      </Backdrop>
      <HoronText variant="label-sm" tone="text-secondary">
        New messages · solid and glass
      </HoronText>
      <View style={styles.row}>
        <NewMessagesPill onPress={jump}>3 new messages</NewMessagesPill>
        <NewMessagesPill disabled onPress={jump}>
          Disabled
        </NewMessagesPill>
      </View>
      <Backdrop>
        <View style={styles.row}>
          <NewMessagesPill surface="glass" onPress={jump}>
            3 new messages
          </NewMessagesPill>
        </View>
      </Backdrop>
      <HoronText variant="label-sm" tone="text-secondary">
        Voice input · recording, stopped, custom levels
      </HoronText>
      <VoiceInput elapsed="0:07" onStop={jump} />
      <VoiceInput elapsed="0:42" recording={false} onStop={jump} />
      <VoiceInput elapsed="0:12" levels={[0.2, 0.6, 1, 0.4, 0.8]} stopLabel="Finish recording" onStop={jump} />
      <Backdrop>
        <VoiceInput surface="glass" elapsed="0:03" onStop={jump} />
      </Backdrop>
      <HoronText variant="label-sm" tone="text-secondary">
        stop pressed {jumps} times
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center" },
});
