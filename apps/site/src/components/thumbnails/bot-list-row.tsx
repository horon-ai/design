import { BotListRow } from "@horon-ai/react";

export default function BotListRowThumbnail() {
  return (
    <div className="flex w-80 flex-col gap-1 rounded-xl bg-bg-surface p-2">
      <BotListRow name="Sales Outbound" time="8:41 AM" preview="Drafts queued for approval." live selected />
      <BotListRow name="Inbox Manager" time="7:02 AM" preview="6 emails need you." live />
    </div>
  );
}
