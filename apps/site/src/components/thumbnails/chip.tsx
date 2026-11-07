import { Chip } from "@horon-ai/react";

export default function ChipThumbnail() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Chip>All</Chip>
      <Chip defaultPressed>Inbox</Chip>
      <Chip>Drafts</Chip>
    </div>
  );
}
