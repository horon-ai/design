import { StyleSheet, View } from "react-native";
import { Bell, CalendarBlank, Moon } from "phosphor-react-native";
import {
  BottomSheet,
  BottomSheetAction,
  BottomSheetActions,
  BottomSheetContent,
  BottomSheetRow,
  BottomSheetTrigger,
  Button,
  HoronText,
  useHoronTheme,
} from "@horon-ai/expo";

/** The Figma panel sheet: a title, a settings row and the action pills. */
function PanelSheet({ floating, surface }: { floating?: boolean; surface: "solid" | "glass" }) {
  const theme = useHoronTheme();
  return (
    <BottomSheet>
      <BottomSheetTrigger render={<Button variant="solid" />}>
        {floating ? "Open floating" : `Open ${surface}`}
      </BottomSheetTrigger>
      <BottomSheetContent title="Reminder" floating={floating} surface={surface}>
        <HoronText variant="body-sm" tone="text-secondary">
          Every weekday at 9:00
        </HoronText>
        <BottomSheetRow icon={<Bell size={20} color={theme.color("text-secondary")} />} value="On">
          Notifications
        </BottomSheetRow>
        <BottomSheetRow icon={<CalendarBlank size={20} color={theme.color("text-secondary")} />} value="Weekdays">
          Repeat
        </BottomSheetRow>
        <BottomSheetActions>
          <BottomSheetAction>Cancel</BottomSheetAction>
          <BottomSheetAction variant="primary">Save</BottomSheetAction>
        </BottomSheetActions>
      </BottomSheetContent>
    </BottomSheet>
  );
}

/** The Paper detail sheet: a caller-built header, set flush left. */
function DetailSheet() {
  const theme = useHoronTheme();
  return (
    <BottomSheet>
      <BottomSheetTrigger render={<Button variant="solid" />}>Open detail</BottomSheetTrigger>
      <BottomSheetContent title="Nightly digest" variant="detail">
        <View style={styles.detailRow}>
          <Moon size={20} color={theme.color("text-secondary")} />
          <HoronText variant="body-sm" tone="text-secondary">
            Sends at 21:00 every weekday; the summary covers what the assistant saved that day.
          </HoronText>
        </View>
        <BottomSheetActions>
          <BottomSheetAction>Dismiss</BottomSheetAction>
          <BottomSheetAction variant="primary">Keep</BottomSheetAction>
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
        Dock full width, float 16pt off the edges, put it on the veil, or use the detail rhythm. The
        grabber dismisses on a downward drag; the bottom pads by the safe-area inset.
      </HoronText>
      <PanelSheet surface="solid" />
      <PanelSheet surface="glass" floating />
      <DetailSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  detailRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
});
