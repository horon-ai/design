import { Card } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function CardDemo() {
  return (
    <Backdrop>
      <Card
        surface="glass"
        className="w-80"
        title="Inbox Manager"
        description="6 emails need you. Drafts are ready for review."
      />
      <Card
        surface="glass"
        className="w-80"
        interactive
        selected
        render={<button type="button" />}
        title="Chief of staff"
        description="Morning brief is ready."
      />
      <Card className="w-80" title="Inbox Manager" description="Solid card on the page." />
    </Backdrop>
  );
}
