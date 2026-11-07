import { Spinner } from "@horon-ai/react";

export default function SpinnerNumeric() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 rounded-full border border-border-default bg-bg-surface px-3 py-1.5 text-label-sm text-text-primary">
        <Spinner size={12} label="Syncing" />
        Syncing
      </div>
      <div className="flex items-center gap-2 rounded-full border border-border-default bg-bg-surface px-3 py-1.5 text-label-sm text-text-primary">
        <Spinner size={20} label="Fetching sources" />
        Fetching sources
      </div>
    </div>
  );
}
