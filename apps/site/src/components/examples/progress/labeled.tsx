import { Progress } from "@horon-ai/react";

export default function ProgressLabeled() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-2">
      <div className="flex items-baseline justify-between text-label-md">
        <span className="text-text-primary">Uploading sources</span>
        <span className="text-text-secondary tabular-nums">64%</span>
      </div>
      <Progress value={64} aria-label="Uploading sources" className="w-full" />
    </div>
  );
}
