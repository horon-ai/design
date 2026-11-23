import {
  BottomSheet,
  BottomSheetAction,
  BottomSheetActions,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetTrigger,
  Button,
} from "@horon-ai/react";

export default function BottomSheetNoBackdrop() {
  return (
    <BottomSheet>
      <BottomSheetTrigger render={<Button variant="solid" />}>Reminder</BottomSheetTrigger>
      <BottomSheetContent title="Reminder" backdrop={false}>
        <p className="text-body-sm text-text-secondary">
          Every weekday at 9:00. The sheet stays docked to the bottom edge while the page behind remains visible.
        </p>
        <BottomSheetActions>
          <BottomSheetClose render={<BottomSheetAction />}>Later</BottomSheetClose>
          <BottomSheetClose render={<BottomSheetAction variant="primary" />}>Save</BottomSheetClose>
        </BottomSheetActions>
      </BottomSheetContent>
    </BottomSheet>
  );
}
