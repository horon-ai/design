import { TaskRow } from "@horon-ai/react";

export default function TaskRowThumbnail() {
  return (
    <div className="w-80">
      <TaskRow
        status="running"
        title="Triage overnight email"
        elapsed="1m 56s"
        bot={{ initial: "C", name: "Chief of staff" }}
        project="Horon HQ"
        message="Reading 41 new emails"
      />
    </div>
  );
}
