import { useEffect, useState } from "@lynx-js/react";

import { TaskRow, type TaskStatus } from "../../src/components/task-row";

/** Retry rewinds a failed task to running, and it finishes on its own a moment later. */
function InteractiveTaskRow() {
  const [status, setStatus] = useState<TaskStatus>("failed");

  useEffect(() => {
    if (status !== "running") return undefined;
    const timer = setTimeout(() => setStatus("done"), 1600);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <TaskRow
      status={status}
      title="Book interviews for next week"
      elapsed="3m 12s"
      bot={{ initial: "R", name: "Recruiter" }}
      project="Q4 hiring"
      message={status === "failed" ? "Failed" : status === "running" ? "Retrying" : "Booked 5 interviews"}
      detail={status === "failed" ? "Google Calendar needs to be reconnected" : "5 holds · 2 confirmed"}
      onRetry={() => setStatus("running")}
      onCancel={() => setStatus("done")}
      onArchive={() => setStatus("failed")}
    />
  );
}

/** Every lifecycle state plus the list variant, mirroring the site demo. */
export default function TaskRowDemo() {
  return (
    <view className="flex w-full flex-col p-4">
      <view className="flex w-full max-w-[640px] flex-col gap-3">
        <InteractiveTaskRow />
        <TaskRow
          status="review"
          title="Draft replies to the investor thread"
          elapsed="6m 40s"
          bot={{ initial: "W", name: "Writer" }}
          project="Investor update"
          message="Ready for review"
          detail="2 drafts · 1 calendar change"
        />
        <TaskRow
          status="failed"
          title="Book interviews for next week"
          elapsed="3m 12s"
          bot={{ initial: "R", name: "Recruiter" }}
          project="Q4 hiring"
          message="Failed"
          detail="Google Calendar needs to be reconnected"
        />
        <TaskRow
          status="done"
          title="Send the Q3 board deck to the team"
          elapsed="9m"
          bot={{ initial: "C", name: "Chief of staff" }}
          project="Horon HQ"
          message="Sent"
          detail="Delivered to 4 people · 2 opened"
        />
        <view className="flex flex-col">
          <TaskRow
            variant="list"
            status="running"
            title="Summarize this week's support tickets"
            elapsed="1m 56s"
            bot={{ initial: "S", name: "Support" }}
            project="Customer care"
            message="Reading tickets"
          />
          <TaskRow
            variant="list"
            status="done"
            title="Send the Q3 board deck to the team"
            elapsed="9m"
            bot={{ initial: "C", name: "Chief of staff" }}
            project="Horon HQ"
            message="Sent"
          />
        </view>
      </view>
    </view>
  );
}
