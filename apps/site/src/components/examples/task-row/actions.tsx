import { Button, TaskRow, type TaskStatus } from "@horon-ai/react";
import { useState } from "react";

const statuses: TaskStatus[] = ["running", "review", "failed", "done"];

export default function TaskRowActions() {
  const [status, setStatus] = useState<TaskStatus>("running");
  return (
    <div className="flex w-full max-w-160 flex-col gap-3">
      <TaskRow
        status={status}
        title="Book interviews for next week"
        elapsed="3m 12s"
        bot={{ initial: "R", name: "Recruiter" }}
        project="Q4 hiring"
        message={
          status === "failed"
            ? "Google Calendar needs to be reconnected"
            : status === "running"
              ? "Booking 5 interview slots"
              : status === "review"
                ? "5 holds, ready for your yes"
                : "Booked 5 interviews"
        }
        detail={status === "done" ? "5 holds · 2 confirmed" : undefined}
        onCancel={() => setStatus("review")}
        onRetry={() => setStatus("running")}
        onReview={() => setStatus("done")}
        onArchive={() => setStatus("done")}
      />
      <div className="flex flex-wrap items-center gap-2">
        {statuses.map((value) => (
          <Button
            key={value}
            size="sm"
            variant={value === status ? "primary" : "solid"}
            aria-pressed={value === status}
            onClick={() => setStatus(value)}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
}
