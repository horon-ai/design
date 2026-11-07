import {
  BottomSheet,
  BottomSheetAction,
  BottomSheetActions,
  BottomSheetContent,
  BottomSheetTrigger,
  Button,
} from "@horon-ai/react";
import { ArrowUpRight } from "@phosphor-icons/react";

export default function BottomSheetDetail() {
  return (
    <BottomSheet>
      <BottomSheetTrigger render={<Button variant="solid" />}>Open detail</BottomSheetTrigger>
      <BottomSheetContent
        variant="detail"
        title={
          <span className="flex min-w-0 flex-col gap-1">
            <span className="text-title-sm text-text-primary">Weekly digest</span>
            <span className="text-body-sm text-text-secondary">Product · every Monday at 8:00</span>
          </span>
        }
      >
        <p className="text-body-md text-text-secondary">
          The digest collects closed issues, shipped reviews and the questions that came up twice. It lands in the team
          channel and in each member&apos;s inbox.
        </p>
        <BottomSheetActions>
          <BottomSheetAction>Turn off</BottomSheetAction>
          <BottomSheetAction variant="primary" className="gap-1.5">
            <ArrowUpRight aria-hidden className="size-4" />
            Open run
          </BottomSheetAction>
        </BottomSheetActions>
      </BottomSheetContent>
    </BottomSheet>
  );
}
