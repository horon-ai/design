import { ToolStep } from "@horon-ai/react";

export default function AgentActivityToolSteps() {
  return (
    <div className="flex w-full max-w-85 flex-col gap-2">
      <ToolStep state="running" title="Searching Gmail" detail="41 emails from last night" />
      <ToolStep state="done" title="Read the Q3 sheet" detail="18 rows" />
      <ToolStep state="failed" title="Couldn't open the calendar" detail="Calendar needs to be reconnected" />
    </div>
  );
}
