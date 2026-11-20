import { StyleSheet, View } from "react-native";
import { Command } from "phosphor-react-native";
import { HoronText, Kbd } from "@horon-ai/expo";

/** The three rungs, the shortcut syntax and hand-composed chips on a text line. */
export default function KbdDemo() {
  return (
    <View style={styles.stack}>
      <View style={styles.row}>
        <Kbd size="sm" keys="Mod+K" />
        <Kbd size="md" keys="Mod+K" />
        <Kbd size="lg" keys="Mod+K" />
      </View>
      <View style={styles.row}>
        <Kbd keys="Mod+Enter" />
        <Kbd keys="Mod+Shift+P" />
        <Kbd keys="Alt+ArrowUp" />
        <Kbd keys="Escape" />
      </View>
      <View style={styles.row}>
        <Kbd size="sm">⌘</Kbd>
        <Kbd size="sm">K</Kbd>
        <Kbd size="md">
          <Command />
        </Kbd>
      </View>
      <View style={styles.row}>
        <HoronText tone="text-secondary">Search</HoronText>
        <Kbd keys="Mod+K" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
});
