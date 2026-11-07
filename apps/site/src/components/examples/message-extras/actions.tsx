import { MessageActions } from "@horon-ai/react";
import { ArrowClockwise, Copy, DotsThree, ThumbsDown, ThumbsUp } from "@phosphor-icons/react";

import { Backdrop } from "../../demo-backdrop";

const actions = [
  { label: "Copy", icon: <Copy /> },
  { label: "Regenerate", icon: <ArrowClockwise /> },
  { label: "Good response", icon: <ThumbsUp /> },
  { label: "Bad response", icon: <ThumbsDown /> },
  { label: "More", icon: <DotsThree /> },
];

export default function MessageExtrasActions() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <MessageActions actions={actions} />
      <Backdrop>
        <MessageActions actions={actions.slice(0, 3)} surface="glass" />
      </Backdrop>
    </div>
  );
}
