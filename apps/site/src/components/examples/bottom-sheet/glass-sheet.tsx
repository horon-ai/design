import {
  BottomSheet,
  BottomSheetAction,
  BottomSheetActions,
  BottomSheetContent,
  BottomSheetTrigger,
  Button,
} from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function BottomSheetGlass() {
  return (
    <Backdrop>
      <BottomSheet>
        <BottomSheetTrigger render={<Button variant="glass" />}>Message options</BottomSheetTrigger>
        <BottomSheetContent title="Message options" surface="glass">
          <p className="text-body-sm text-text-primary">Quote the message, pin it, or forward it to another bot.</p>
          <BottomSheetActions>
            <BottomSheetAction>Forward</BottomSheetAction>
            <BottomSheetAction variant="primary">Reply</BottomSheetAction>
          </BottomSheetActions>
        </BottomSheetContent>
      </BottomSheet>
    </Backdrop>
  );
}
