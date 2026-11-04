import { Attachment, CodeBlock, DateSeparator, MessageActions } from "@horon-ai/react";
import { ArrowClockwise, Copy, DotsThree, ThumbsDown, ThumbsUp } from "@phosphor-icons/react";

const actions = [
  { label: "Copy", icon: <Copy /> },
  { label: "Regenerate", icon: <ArrowClockwise /> },
  { label: "Good response", icon: <ThumbsUp /> },
  { label: "Bad response", icon: <ThumbsDown /> },
  { label: "More", icon: <DotsThree /> },
];

export default function MessageExtrasDemo() {
  return (
    <div className="flex w-full max-w-90 flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <MessageActions actions={actions} />
        <MessageActions actions={actions.slice(0, 3)} surface="glass" />
      </div>
      <DateSeparator>Today</DateSeparator>
      <Attachment name="Q3 board deck v5.pdf" detail="PDF · 2.4 MB" onRemove={() => undefined} />
      <CodeBlock language="bash" code={"horon routine run weekly-report \\\n  --to alpoxdev@gmail.com"} />
    </div>
  );
}
