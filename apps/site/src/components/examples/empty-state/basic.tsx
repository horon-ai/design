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

export default function EmptyStateBasic() {
  return (
    <EmptyState
      illustration={<Mascot name="horon-mascot-welcome" />}
      title="Meet your first bot"
      description="Give it a role and a task. It keeps working after you close the laptop."
      action={<Button>Create a bot</Button>}
    />
  );
}
