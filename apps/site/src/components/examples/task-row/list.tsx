import { TaskRow } from "@horon-ai/react";

export default function TaskRowList() {
  return (
    <div className="flex w-full max-w-160 flex-col">
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
        status="review"
        title="Draft replies to the investor thread"
        elapsed="6m 40s"
        bot={{ initial: "W", name: "Writer" }}
        project="Investor update"
        message="Ready for review"
        onReview={() => undefined}
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
    </div>
  );
}
