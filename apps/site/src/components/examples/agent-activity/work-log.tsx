import { WorkLog } from "@horon-ai/react";

export default function AgentActivityWorkLog() {
  return (
    <WorkLog
      summary="Worked for 42s · 3 steps"
      steps={[
        { id: "read", title: "Read 41 new emails", detail: "Inbox · since 6 PM" },
        { id: "sort", title: "Sorted 6 that need you", detail: "Flagged in Inbox" },
        { id: "draft", title: "Drafting replies", detail: "2 of 6 done", running: true },
      ]}
    />
  );
}
