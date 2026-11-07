import { Progress } from "@horon-ai/react";

export default function ProgressIndeterminate() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Progress aria-label="Loading agents" />
      <Progress value={null} aria-label="Loading settings" />
    </div>
  );
}
