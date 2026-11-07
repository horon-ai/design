import {
  BottomSheet,
  BottomSheetAction,
  BottomSheetActions,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetRow,
  BottomSheetTrigger,
} from "../../src/components/bottom-sheet";
import { Button } from "../../src/components/button";
import { Icon } from "../../src/icons";

/** The settings sheet: three rows and the action row that closes it. */
export default function BottomSheetDemo() {
  return (
    <view className="flex w-full flex-col items-center gap-4 p-4">
      <BottomSheet>
        <BottomSheetTrigger render={<Button />}>Open sheet</BottomSheetTrigger>
        <BottomSheetContent title="Chief of staff">
          <BottomSheetRow icon={<Icon name="Bell" size={20} color="text-secondary" />} value="On">
            Notifications
          </BottomSheetRow>
          <BottomSheetRow icon={<Icon name="CalendarBlank" size={20} color="text-secondary" />} value="Weekdays">
            Schedule
          </BottomSheetRow>
          <BottomSheetRow icon={<Icon name="GearSix" size={20} color="text-secondary" />}>Bot settings</BottomSheetRow>
          <BottomSheetActions>
            <BottomSheetClose render={<BottomSheetAction />}>Cancel</BottomSheetClose>
            <BottomSheetAction variant="primary">Open chat</BottomSheetAction>
          </BottomSheetActions>
        </BottomSheetContent>
      </BottomSheet>
      <text className="text-caption text-text-secondary">
        The grabber dismisses on a downward drag; the scrim and Cancel close it too.
      </text>
    </view>
  );
}
