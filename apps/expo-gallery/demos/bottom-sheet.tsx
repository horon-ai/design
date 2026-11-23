import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Bell, CalendarBlank, Moon } from "phosphor-react-native";
import { spacing } from "@horon-ai/tokens";
import {
  BottomSheet,
  BottomSheetAction,
  BottomSheetActions,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetRow,
  BottomSheetTrigger,
  Button,
  HoronText,
  Input,
  useHoronTheme,
} from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

/** The docked panel sheet: a title, settings rows and the action pills. */
function PanelSheet({ surface, maxWidth }: { surface: "solid" | "glass"; maxWidth?: number | "none" }) {
  const theme = useHoronTheme();
  const label = maxWidth === "none" ? "Open full width" : `Open ${surface}`;
  const trigger = (
    <BottomSheetTrigger render={<Button variant={surface === "glass" ? "glass" : "solid"} />}>
      {label}
    </BottomSheetTrigger>
  );
  return (
    <BottomSheet>
      {surface === "glass" ? <Backdrop>{trigger}</Backdrop> : trigger}
      <BottomSheetContent title="Reminder" surface={surface} maxWidth={maxWidth}>
        <HoronText variant="body-sm" tone={surface === "glass" ? "text-primary" : "text-secondary"}>
          Every weekday at 9:00
        </HoronText>
        <BottomSheetRow icon={<Bell size={20} color={theme.color("text-secondary")} />} value="On">
          Notifications
        </BottomSheetRow>
        <BottomSheetRow icon={<CalendarBlank size={20} color={theme.color("text-secondary")} />} value="Weekdays">
          Repeat
        </BottomSheetRow>
        <BottomSheetActions>
          <BottomSheetClose render={<BottomSheetAction />}>Cancel</BottomSheetClose>
          <BottomSheetClose render={<BottomSheetAction variant="primary" />}>Save</BottomSheetClose>
        </BottomSheetActions>
      </BottomSheetContent>
    </BottomSheet>
  );
}

/** The detail sheet: a caller-built header, set flush left. */
function DetailSheet() {
  const theme = useHoronTheme();
  return (
    <BottomSheet>
      <BottomSheetTrigger render={<Button variant="solid" />}>Open detail</BottomSheetTrigger>
      <BottomSheetContent title="Nightly digest" variant="detail">
        <View style={styles.detailRow}>
          <Moon size={20} color={theme.color("text-secondary")} />
          <HoronText variant="body-sm" tone="text-secondary" style={styles.detailCopy}>
            Sends at 21:00 every weekday; the summary covers what the assistant saved that day.
          </HoronText>
        </View>
        <BottomSheetActions>
          <BottomSheetClose render={<BottomSheetAction />}>Dismiss</BottomSheetClose>
          <BottomSheetClose render={<BottomSheetAction variant="primary" />}>Keep</BottomSheetClose>
        </BottomSheetActions>
      </BottomSheetContent>
    </BottomSheet>
  );
}

/** A long scrollable sheet with a labelled text input, for checking max-height cap and keyboard lift. */
function ScrollableFormSheet() {
  const [note, setNote] = useState("");
  const theme = useHoronTheme();
  return (
    <BottomSheet>
      <BottomSheetTrigger render={<Button variant="solid" />}>Open scrollable</BottomSheetTrigger>
      <BottomSheetContent title="Workspace options">
        <View style={styles.field}>
          <HoronText variant="label-sm" tone="text-secondary">
            Filter note
          </HoronText>
          <Input
            aria-label="Filter note"
            surface="solid-on-page"
            value={note}
            onValueChange={setNote}
            placeholder="Type to test keyboard lift"
          />
        </View>
        {Array.from({ length: 12 }, (_, index) => (
          <BottomSheetRow
            key={index}
            icon={<Bell size={20} color={theme.color("text-secondary")} />}
            value={`Item ${index + 1}`}
          >
            {`Channel setting ${index + 1}`}
          </BottomSheetRow>
        ))}
        <BottomSheetActions>
          <BottomSheetClose render={<BottomSheetAction />}>Cancel</BottomSheetClose>
          <BottomSheetClose render={<BottomSheetAction variant="primary" />}>Done</BottomSheetClose>
        </BottomSheetActions>
      </BottomSheetContent>
    </BottomSheet>
  );
}

export default function BottomSheetDemo() {
  return (
    <View style={styles.stack}>
      <HoronText variant="title-sm">Bottom sheet</HoronText>
      <HoronText variant="body-sm" tone="text-secondary">
        Docks flush to the left, right and bottom edges on phones, and centres at maxWidth (560pt by default) on wider
        screens while staying anchored to the bottom with safe-area content padding.
      </HoronText>
      <PanelSheet surface="solid" />
      <PanelSheet surface="glass" />
      <DetailSheet />
      <PanelSheet surface="solid" maxWidth="none" />
      <ScrollableFormSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing["4"] },
  detailRow: { flexDirection: "row", gap: spacing["3"], alignItems: "flex-start" },
  detailCopy: { flex: 1 },
  field: { gap: spacing["1.5"] },
});
