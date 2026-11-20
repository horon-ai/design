import { StyleSheet, View } from "react-native";
import { GearSix } from "phosphor-react-native";
import {
  Button,
  Dialog,
  DialogClose,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  HoronText,
} from "@horon-ai/expo";

/** One dialog, wired the way a screen wires a rename confirmation. */
function RenameDialog({ surface }: { surface: "glass" | "solid" }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="solid" />}>{surface === "glass" ? "Open glass" : "Open solid"}</DialogTrigger>
      <DialogContent
        title="Rename bot"
        description="The new name shows up everywhere the bot is mentioned."
        surface={surface}
        leading={surface === "glass" ? <GearSix size={24} /> : undefined}
      >
        <HoronText variant="body-sm" tone="text-secondary">
          Body content sits under the description, 16pt below it.
        </HoronText>
        <DialogFooter>
          <DialogClose render={<Button variant="solid" />}>Cancel</DialogClose>
          <DialogClose>Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DialogDemo() {
  return (
    <View style={styles.stack}>
      <HoronText variant="title-sm">Dialog</HoronText>
      <HoronText variant="body-sm" tone="text-secondary">
        `solid` is the default surface; `glass` puts the panel on the veil. Both close on the scrim, the
        close control, the Cancel/Save row and the Android back button.
      </HoronText>
      <View style={styles.row}>
        <RenameDialog surface="solid" />
        <RenameDialog surface="glass" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center" },
});
