import { StreamingText, ThinkingIndicator, ToolStep, WorkLog } from "@horon-ai/react";

export default function AgentActivityDemo() {
  return (
    <div className="flex w-full max-w-85 flex-col items-start gap-4">
      <ThinkingIndicator />
      <StreamingText>Drafted replies for 2 of 6 emails. Working on</StreamingText>
      <ToolStep state="running" title="Searching Gmail" detail="41 emails from last night" />
      <ToolStep state="failed" title="Couldn't open the calendar" detail="Calendar needs to be reconnected" />
      <WorkLog
        summary="Worked for 42s · 3 steps"
        steps={[
          { id: "read", title: "Read 41 new emails", detail: "Inbox · since 6 PM" },
          { id: "sort", title: "Sorted 6 that need you", detail: "Flagged in Inbox" },
          { id: "draft", title: "Drafting replies", detail: "2 of 6 done", running: true },
        ]}
      />
    </div>
  );
}
