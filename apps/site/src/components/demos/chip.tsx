import { Chip } from "@horon-ai/react";

export default function ChipDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Chip size="sm" defaultPressed>
          Small
        </Chip>
        <Chip defaultPressed>Medium</Chip>
        <Chip size="lg" defaultPressed>
          Large
        </Chip>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Chip>All</Chip>
        <Chip defaultPressed>Inbox</Chip>
        <Chip>Drafts</Chip>
        <Chip disabled>Archive</Chip>
      </div>
    </div>
  );
}
