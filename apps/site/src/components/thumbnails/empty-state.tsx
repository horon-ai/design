import { Button, EmptyState } from "@horon-ai/react";

export default function EmptyStateThumbnail() {
  return (
    <EmptyState
      className="max-w-80 py-4"
      title="Nothing matches"
      description="Try another name or clear the filter."
      action={<Button>Clear filter</Button>}
    />
  );
}
