import { Card } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-4">
      <Card
        surface={surface}
        className="w-80"
        title="Inbox Manager"
        description="6 emails need you. Drafts are ready for review."
      />
      <Card
        surface={surface}
        className="w-80"
        interactive
        selected
        render={<button type="button" />}
        title="Chief of staff"
        description="Morning brief is ready."
      />
    </div>
  );
}

export default function CardDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <Examples surface="solid" />
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <Examples surface="glass" />
      </Backdrop>
    </div>
  );
}
