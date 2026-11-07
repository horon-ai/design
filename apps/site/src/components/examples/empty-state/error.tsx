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

export default function EmptyStateError() {
  return (
    <EmptyState
      illustration={<Mascot name="horon-mascot-error" />}
      title="Something went wrong"
      description="We could not load your bots. Check the connection and try again."
      action={<Button>Try again</Button>}
    />
  );
}
