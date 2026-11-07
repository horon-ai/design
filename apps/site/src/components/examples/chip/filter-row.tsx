import { Chip } from "@horon-ai/react";

export default function ChipFilterRow() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Chip>All</Chip>
        <Chip defaultPressed>Inbox</Chip>
        <Chip defaultPressed>Drafts</Chip>
        <Chip>Archive</Chip>
        <Chip disabled>Trash</Chip>
      </div>
      <p className="text-caption text-text-secondary">Two filters are on at once; Trash cannot be picked right now.</p>
    </div>
  );
}
