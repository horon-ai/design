import { Attachment, CodeBlock, DateSeparator, MessageActions } from "@horon-ai/react";
import { ArrowClockwise, Copy, DotsThree, ThumbsDown, ThumbsUp } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

const actions = [
  { label: "Copy", icon: <Copy /> },
  { label: "Regenerate", icon: <ArrowClockwise /> },
  { label: "Good response", icon: <ThumbsUp /> },
  { label: "Bad response", icon: <ThumbsDown /> },
  { label: "More", icon: <DotsThree /> },
];

function Extras({ surface }: { surface: "solid" | "glass" }) {
  return (
    <div className="flex w-full max-w-90 flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <MessageActions actions={actions} surface={surface} />
        <MessageActions actions={actions.slice(0, 3)} surface={surface} />
      </div>
      <DateSeparator>Today</DateSeparator>
      <Attachment name="Q3 board deck v5.pdf" detail="PDF · 2.4 MB" onRemove={() => undefined} />
      <CodeBlock language="bash" code={"horon routine run weekly-report \\\n  --to alpoxdev@gmail.com"} />
    </div>
  );
}

export default function MessageExtrasDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col items-center gap-3">
        <p className="w-full max-w-90 text-caption text-text-secondary">Solid</p>
        <Extras surface="solid" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="w-full max-w-90 text-caption text-text-secondary">Glass</p>
        <Backdrop>
          <Extras surface="glass" />
        </Backdrop>
      </div>
    </div>
  );
}
