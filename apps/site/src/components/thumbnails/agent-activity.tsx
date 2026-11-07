import { StreamingText, ToolStep } from "@horon-ai/react";

export default function AgentActivityThumbnail() {
  return (
    <div className="flex w-80 flex-col items-start gap-4">
      <StreamingText text="Drafted replies for 2 of 6 emails. Working on the Larkspur invoice thread next." />
      <ToolStep state="done" title="Searched Gmail" detail="41 emails from last night" />
    </div>
  );
}
