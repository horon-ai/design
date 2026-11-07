import { Button, EmptyState } from "@horon-ai/react";

export default function EmptyStateWithoutIllustration() {
  return (
    <EmptyState
      title="No sources yet"
      description="Add a page, a file or a feed and the agent can answer from it."
      action={<Button variant="solid">Add source</Button>}
    />
  );
}
