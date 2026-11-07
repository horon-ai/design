import { BotListRow } from "@horon-ai/react";

export default function BotListRowStates() {
  return (
    <div className="flex w-full max-w-90 flex-col gap-1">
      <BotListRow name="Running" time="just now" preview="Watching the inbox." live />
      <BotListRow name="Open in the panel" time="8:41 AM" preview="Selected row." selected />
      <BotListRow name="Running and open" time="8:41 AM" preview="Both states at once." live selected />
      <BotListRow name="Idle" time="Yesterday" preview="No run today." />
    </div>
  );
}
