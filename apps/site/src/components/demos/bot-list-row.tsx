import { BotListRow } from "@horon-ai/react";

export default function BotListRowDemo() {
  return (
    <div className="flex w-full max-w-90 flex-col gap-1">
      <BotListRow name="Sales Outbound" time="8:41 AM" preview="Outreach drafts queued for approval." live selected />
      <BotListRow name="Inbox Manager" time="7:02 AM" preview="6 emails need you." live />
      <BotListRow name="Recruiter" time="Yesterday" preview="Paused. Turn on to resume outreach." />
    </div>
  );
}
