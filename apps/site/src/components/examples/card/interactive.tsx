import { Card } from "@horon-ai/react";

export default function CardInteractive() {
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-4">
      <Card
        interactive
        render={<button type="button" />}
        className="w-full max-w-72"
        title="Inbox Manager"
        description="Open the drafts waiting for review."
      />
      <Card
        interactive
        render={<button type="button" />}
        className="w-full max-w-72"
        title="Weekly digest"
        description="Last one was sent on Monday."
      />
    </div>
  );
}
