import { BotListRow } from "@horon-ai/react";

export default function BotListRowMinimal() {
  return (
    <div className="flex w-full max-w-90 flex-col gap-1">
      <BotListRow name="Researcher" time="8:41 AM" />
      <BotListRow name="Scheduler" />
    </div>
  );
}
