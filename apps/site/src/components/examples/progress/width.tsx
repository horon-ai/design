import { Progress } from "@horon-ai/react";

export default function ProgressWidth() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full max-w-72 flex-col gap-2">
        <span className="text-caption text-text-secondary">Default 240px</span>
        <Progress value={45} aria-label="Default width" />
      </div>
      <div className="flex w-full max-w-72 flex-col gap-2">
        <span className="text-caption text-text-secondary">w-full</span>
        <Progress value={45} aria-label="Full width" className="w-full" />
      </div>
    </div>
  );
}
