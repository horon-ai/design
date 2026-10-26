import {
  BottomSheet,
  BottomSheetAction,
  BottomSheetActions,
  BottomSheetContent,
  BottomSheetRow,
  BottomSheetTrigger,
  Button,
} from "@horon-ai/react";
import { Bell, CalendarBlank, GearSix } from "@phosphor-icons/react";

export default function BottomSheetDemo() {
  return (
    <BottomSheet>
      <BottomSheetTrigger render={<Button />}>Open sheet</BottomSheetTrigger>
      <BottomSheetContent title="Chief of staff">
        <BottomSheetRow icon={<Bell />} value="On">
          Notifications
        </BottomSheetRow>
        <BottomSheetRow icon={<CalendarBlank />} value="Weekdays">
          Schedule
        </BottomSheetRow>
        <BottomSheetRow icon={<GearSix />}>Bot settings</BottomSheetRow>
        <BottomSheetActions>
          <BottomSheetAction>Pause</BottomSheetAction>
          <BottomSheetAction variant="primary">Open chat</BottomSheetAction>
        </BottomSheetActions>
      </BottomSheetContent>
    </BottomSheet>
  );
}
