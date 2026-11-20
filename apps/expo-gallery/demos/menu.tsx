import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { GearSix, SignOut, Trash } from "phosphor-react-native";
import {
  Button,
  HoronText,
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTile,
  MenuTrigger,
  useHoronTheme,
  type MenuSurface,
} from "@horon-ai/expo";

/** One menu per surface, anchored below its trigger. */
function AccountMenu({ surface }: { surface: MenuSurface }) {
  const theme = useHoronTheme();
  const [picked, setPicked] = useState("none");
  return (
    <Menu>
      <MenuTrigger render={<Button variant="solid" />}>{surface}</MenuTrigger>
      <MenuContent surface={surface} align="start">
        <MenuLabel>Picked: {picked}</MenuLabel>
        <MenuItem icon={<GearSix size={18} />} trailing="⌘," onClick={() => setPicked("Settings")}>
          Settings
        </MenuItem>
        <MenuItem icon={<MenuTile>A</MenuTile>} description="12 members" onClick={() => setPicked("Acme")}>
          Acme
        </MenuItem>
        <MenuItem icon={<MenuTile style={{ backgroundColor: theme.color("accent-sky-500-90") }}>L</MenuTile>} selected onClick={() => setPicked("Labs")}>
          Labs
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={<SignOut size={18} />} disabled>
          Sign out
        </MenuItem>
        <MenuItem icon={<Trash size={18} />} danger onClick={() => setPicked("Delete")}>
          Delete account
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}

export default function MenuDemo() {
  return (
    <View style={styles.stack}>
      <HoronText variant="title-sm">Menu</HoronText>
      <HoronText variant="body-sm" tone="text-secondary">
        `glass` is the Figma menu on the veil, `solid` the account menu over chrome, `paper` the workspace
        switcher. The popup is anchored to its trigger with `measureInWindow` and flips when it would not fit.
      </HoronText>
      <View style={styles.row}>
        <AccountMenu surface="glass" />
        <AccountMenu surface="solid" />
        <AccountMenu surface="paper" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center" },
});
