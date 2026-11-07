import { Spinner } from "@horon-ai/react";

export default function SpinnerThumbnail() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <span className="text-body-sm text-text-secondary">Drafting your brief…</span>
    </div>
  );
}
