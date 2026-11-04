import { Chip } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function ChipDemo() {
  return (
    <Backdrop className="flex-col gap-3!">
      <div className="flex flex-wrap items-center gap-2">
        <Chip size="sm" defaultPressed>
          Small
        </Chip>
        <Chip defaultPressed>Medium</Chip>
        <Chip size="lg" defaultPressed>
          Large
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip>All</Chip>
        <Chip defaultPressed>Inbox</Chip>
        <Chip>Drafts</Chip>
        <Chip disabled>Archive</Chip>
      </div>
    </Backdrop>
  );
}
