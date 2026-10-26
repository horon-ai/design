import { Button, EmptyState } from "@horon-ai/react";

export default function EmptyStateDemo() {
  return (
    <EmptyState
      illustration={
        <span
          aria-hidden
          className="block size-full bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/mascots/horon-mascot-welcome.webp)" }}
        />
      }
      title="Meet your first bot"
      description="Give it a role and a task. It keeps working after you close the laptop."
      action={<Button>Create a bot</Button>}
    />
  );
}
