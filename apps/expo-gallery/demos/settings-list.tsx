import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gear, Robot } from "phosphor-react-native";
import {
  Button,
  HoronText,
  SettingsKey,
  SettingsKeys,
  SettingsList,
  SettingsRow,
  SettingsRowIcon,
  SettingsSwitch,
} from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

/** Solid and glass cards, every row shape and the keycaps. */
export default function SettingsListDemo() {
  const [sync, setSync] = useState(true);
  const [memory, setMemory] = useState(false);
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Solid · switches, a plain value and a leading icon
      </HoronText>
      <SettingsList>
        <SettingsRow
          title="Sync on Wi-Fi"
          description="Only use Wi-Fi for uploads"
          control={<SettingsSwitch checked={sync} onCheckedChange={setSync} />}
        />
        <SettingsRow
          title="Remember bot memory"
          description="Keep a summary between sessions"
          leading={<SettingsRowIcon>{<Robot size={16} />}</SettingsRowIcon>}
          control={<SettingsSwitch checked={memory} onCheckedChange={setMemory} />}
        />
        <SettingsRow title="Version" control="2.4.1" />
        <SettingsRow
          title="Shortcut"
          description="Open the palette from anywhere"
          control={
            <SettingsKeys>
              <SettingsKey>Mod</SettingsKey>
              <SettingsKey>K</SettingsKey>
            </SettingsKeys>
          }
        />
        <SettingsRow title="Team" description="Three members" control={<Button variant="link">Manage</Button>} />
      </SettingsList>
      <HoronText variant="label-sm" tone="text-secondary">
        Glass · a thick glass card keeps the rows above the layer
      </HoronText>
      <Backdrop>
        <SettingsList surface="glass">
          <SettingsRow title="Notifications" control={<SettingsSwitch defaultChecked />} />
          <SettingsRow title="Search index" control={<SettingsSwitch />} />
        </SettingsList>
      </Backdrop>
      <View style={styles.row}>
        <SettingsRowIcon>{<Gear size={16} />}</SettingsRowIcon>
        <SettingsKey>Esc</SettingsKey>
        <SettingsKeys>
          <SettingsKey>Shift</SettingsKey>
          <SettingsKey>Enter</SettingsKey>
        </SettingsKeys>
      </View>
      <HoronText variant="caption" tone="text-secondary">
        sync {sync ? "on" : "off"} · memory {memory ? "on" : "off"}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
});
