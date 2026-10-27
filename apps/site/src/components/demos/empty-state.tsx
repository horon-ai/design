import { Button, EmptyState } from "@horon-ai/react";

function Mascot({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="block size-full bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: `url(/mascots/${name}.webp)` }}
    />
  );
}

export default function EmptyStateDemo() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <EmptyState
        illustration={<Mascot name="horon-mascot-welcome" />}
        title="Meet your first bot"
        description="Give it a role and a task. It keeps working after you close the laptop."
        action={<Button>Create a bot</Button>}
      />
      <EmptyState
        illustration={<Mascot name="horon-mascot-search" />}
        title="Nothing matches"
        description="Try another name or clear the filter."
        action={<Button>Clear filter</Button>}
      />
      <EmptyState
        illustration={<Mascot name="horon-mascot-error" />}
        title="Something went wrong"
        description="We could not load your bots. Check the connection and try again."
        action={<Button variant="glass">Try again</Button>}
      />
    </div>
  );
}
