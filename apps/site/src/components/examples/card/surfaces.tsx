import { Card } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function CardSurfaces() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full flex-wrap items-start justify-center gap-4">
        <Card
          className="w-full max-w-72"
          title="Inbox Manager"
          description="6 emails need you. Drafts are ready for review."
        />
        <Card
          className="w-full max-w-72"
          title="Weekly digest"
          description="Everything the assistant saved this week."
        />
      </div>
      <Backdrop>
        <Card
          surface="glass"
          className="w-full max-w-72"
          title="Inbox Manager"
          description="Glass keeps the sky visible behind the card."
        />
        <Card
          surface="frost"
          className="w-full max-w-72"
          title="Weekly digest"
          description="Frost is the denser fill with a drop shadow."
        />
      </Backdrop>
    </div>
  );
}
