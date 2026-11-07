import { Spinner } from "@horon-ai/react";

export default function SpinnerWithText() {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="flex items-center gap-2 text-body-sm text-text-secondary">
        <Spinner size="sm" label="Saving" />
        Saving
      </span>
      <span className="flex items-center gap-2 text-body-sm text-text-secondary">
        <Spinner size="sm" label="Loading agents" />
        Loading agents
      </span>
    </div>
  );
}
