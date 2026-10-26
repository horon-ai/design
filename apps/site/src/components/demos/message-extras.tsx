import { Attachment, CodeBlock, DateSeparator, MessageActions } from "@horon-ai/react";
import { ArrowClockwise, Copy, DotsThree, ThumbsDown, ThumbsUp } from "@phosphor-icons/react";

export default function MessageExtrasDemo() {
  return (
    <div className="flex w-full max-w-90 flex-col gap-6">
      <MessageActions
        actions={[
          { label: "Copy", icon: <Copy /> },
          { label: "Regenerate", icon: <ArrowClockwise /> },
          { label: "Good response", icon: <ThumbsUp /> },
          { label: "Bad response", icon: <ThumbsDown /> },
          { label: "More", icon: <DotsThree /> },
        ]}
      />
      <DateSeparator>Today</DateSeparator>
      <Attachment name="Q3 board deck v5.pdf" detail="PDF · 2.4 MB" onRemove={() => undefined} />
      <CodeBlock language="bash" code={"horon routine run weekly-report \\\n  --to alpoxdev@gmail.com"} />
    </div>
  );
}
