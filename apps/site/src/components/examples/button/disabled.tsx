import { Button } from "@horon-ai/react";

export default function ButtonDisabled() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button disabled>Save changes</Button>
      <Button variant="solid" disabled>
        Cancel
      </Button>
      <Button variant="danger" disabled>
        Delete bot
      </Button>
      <Button variant="link" disabled>
        Show all
      </Button>
    </div>
  );
}
