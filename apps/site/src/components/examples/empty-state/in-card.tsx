import { Button, Card, EmptyState } from "@horon-ai/react";

export default function EmptyStateInCard() {
  return (
    <Card className="w-full max-w-96" title="Connected sources">
      <EmptyState
        title="No sources yet"
        description="Connect a page or a file and the agent can answer from it."
        action={<Button size="sm">Add source</Button>}
        className="mx-auto"
      />
    </Card>
  );
}
