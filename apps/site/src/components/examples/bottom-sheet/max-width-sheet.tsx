import {
  BottomSheet,
  BottomSheetAction,
  BottomSheetActions,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetTrigger,
  Button,
} from "@horon-ai/react";

export default function BottomSheetMaxWidth() {
  return (
    <div className="flex flex-wrap gap-2">
      <BottomSheet>
        <BottomSheetTrigger render={<Button variant="solid" />}>Default (560px)</BottomSheetTrigger>
        <BottomSheetContent title="Default width">
          <p className="text-body-sm text-text-secondary">
            Fills 100% width flush to the edges on phones, and centres at 560px on tablets and desktop screens.
          </p>
          <BottomSheetActions>
            <BottomSheetClose render={<BottomSheetAction variant="primary" />}>Done</BottomSheetClose>
          </BottomSheetActions>
        </BottomSheetContent>
      </BottomSheet>

      <BottomSheet>
        <BottomSheetTrigger render={<Button variant="solid" />}>Compact (400px)</BottomSheetTrigger>
        <BottomSheetContent title="Compact width" maxWidth={400}>
          <p className="text-body-sm text-text-secondary">
            Caps at 400px on wider viewports while still docking flush to the bottom edge.
          </p>
          <BottomSheetActions>
            <BottomSheetClose render={<BottomSheetAction variant="primary" />}>Done</BottomSheetClose>
          </BottomSheetActions>
        </BottomSheetContent>
      </BottomSheet>

      <BottomSheet>
        <BottomSheetTrigger render={<Button variant="solid" />}>Full width (&quot;none&quot;)</BottomSheetTrigger>
        <BottomSheetContent title="Full width" maxWidth="none">
          <p className="text-body-sm text-text-secondary">
            Passing maxWidth=&quot;none&quot; removes the width cap so the sheet spans the entire viewport width.
          </p>
          <BottomSheetActions>
            <BottomSheetClose render={<BottomSheetAction variant="primary" />}>Done</BottomSheetClose>
          </BottomSheetActions>
        </BottomSheetContent>
      </BottomSheet>
    </div>
  );
}
