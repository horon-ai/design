import { Progress } from "@horon-ai/react";

export default function ProgressDeterminate() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Progress value={0} aria-label="Not started" />
      <Progress value={40} aria-label="Uploading" />
      <Progress value={100} aria-label="Complete" />
    </div>
  );
}
