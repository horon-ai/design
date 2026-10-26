import { Progress } from "@horon-ai/react";

export default function ProgressDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Progress value={0} aria-label="Not started" />
      <Progress value={40} aria-label="In progress" />
      <Progress value={100} aria-label="Done" />
    </div>
  );
}
