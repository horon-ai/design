import { Attachment, DateSeparator, MessageActions } from "@horon-ai/react";
import { ArrowClockwise, Copy, DotsThree, ThumbsUp } from "@phosphor-icons/react";

const actions = [
  { label: "Copy", icon: <Copy /> },
  { label: "Regenerate", icon: <ArrowClockwise /> },
  { label: "Good response", icon: <ThumbsUp /> },
  { label: "More", icon: <DotsThree /> },
];

export default function MessageExtrasThumbnail() {
  return (
    <div className="flex w-72 flex-col gap-3 rounded-xl bg-bg-surface p-3">
      <DateSeparator>Today</DateSeparator>
      <MessageActions actions={actions} />
      <Attachment name="Q3 board deck v5.pdf" detail="PDF · 2.4 MB" onRemove={() => undefined} />
    </div>
  );
}
