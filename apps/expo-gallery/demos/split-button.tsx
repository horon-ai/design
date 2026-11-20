import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { CalendarBlank, CaretDown, Plus } from "phosphor-react-native";
import { HoronText, MenuItem, MenuSeparator, SplitButton } from "@horon-ai/expo";

/** The plain pill, the split pill with a menu, an icon and the disabled pill. */
export default function SplitButtonDemo() {
  const [last, setLast] = useState("none");
  const pick = (label: string) => () => setLast(label);

  return (
    <View style={styles.stack}>
      <View style={styles.row}>
        <SplitButton onClick={pick("Publish")}>Publish</SplitButton>
        <SplitButton icon={<Plus />} onClick={pick("New bot")}>
          New bot
        </SplitButton>
        <SplitButton disabled>Disabled</SplitButton>
      </View>
      <View style={styles.row}>
        <SplitButton
          icon={<CaretDown />}
          menuLabel="Publish options"
          onClick={pick("Publish now")}
          menu={
            <>
              <MenuItem onClick={pick("Schedule")}>Schedule</MenuItem>
              <MenuItem description="Keeps the current version live." onClick={pick("Save as draft")}>
                Save as draft
              </MenuItem>
              <MenuSeparator />
              <MenuItem danger onClick={pick("Discard")}>
                Discard
              </MenuItem>
            </>
          }
        >
          Publish
        </SplitButton>
        <SplitButton
          icon={<CalendarBlank />}
          menuLabel="Export options"
          onClick={pick("Export")}
          menu={
            <>
              <MenuItem onClick={pick("Export CSV")}>Export CSV</MenuItem>
              <MenuItem onClick={pick("Export JSON")}>Export JSON</MenuItem>
            </>
          }
        >
          Export
        </SplitButton>
      </View>
      <HoronText tone="text-secondary">last {last}</HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center" },
});
