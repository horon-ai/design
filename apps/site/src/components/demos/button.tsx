import { Button } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

function Examples({ variant }: { variant: "solid" | "glass" }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button variant={variant}>Cancel</Button>
      <Button variant={variant} icon={<Plus />}>
        New bot
      </Button>
      <Button variant={variant} size="sm">
        Small
      </Button>
      <Button variant={variant} size="lg">
        Large
      </Button>
      <Button variant={variant} disabled>
        Disabled
      </Button>
      {/* The primary, danger and link variants are opaque; they only sit on the page, never on the glass row. */}
      {variant === "solid" && (
        <>
          <Button>Approve</Button>
          <Button variant="danger">Delete bot</Button>
          <Button variant="link">Show all</Button>
        </>
      )}
    </div>
  );
}

export default function ButtonDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <Examples variant="solid" />
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <Examples variant="glass" />
      </Backdrop>
    </div>
  );
}
