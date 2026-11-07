import { Progress } from "@horon-ai/react";

export default function ProgressThumbnail() {
  return (
    <div className="flex w-72 flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-label-md text-text-primary">Uploading files</span>
        <span className="text-caption tabular-nums text-text-secondary">64%</span>
      </div>
      <Progress value={64} className="w-full" aria-label="Uploading files" />
    </div>
  );
}
