import {
  BottomSheet,
  BottomSheetAction,
  BottomSheetActions,
  BottomSheetContent,
  BottomSheetTrigger,
  Button,
} from "@horon-ai/react";

export default function BottomSheetFloating() {
  return (
    <BottomSheet>
      <BottomSheetTrigger render={<Button variant="solid" />}>Reminder</BottomSheetTrigger>
      <BottomSheetContent title="Reminder" floating backdrop={false}>
        <p className="text-body-sm text-text-secondary">Every weekday at 9:00. The panel stays 16px off the sides.</p>
        <BottomSheetActions>
          <BottomSheetAction>Later</BottomSheetAction>
          <BottomSheetAction variant="primary">Save</BottomSheetAction>
        </BottomSheetActions>
      </BottomSheetContent>
    </BottomSheet>
  );
}
