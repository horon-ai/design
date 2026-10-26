import { Chip } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function ChipDemo() {
  return (
    <Backdrop>
      <Chip>All</Chip>
      <Chip defaultPressed>Inbox</Chip>
      <Chip>Drafts</Chip>
      <Chip disabled>Archive</Chip>
    </Backdrop>
  );
}
