import { Card } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function CardDemo() {
  return (
    <Backdrop>
      <Card className="w-72" title="Inbox Manager" description="6 emails need you. Drafts are ready for review." />
      <Card
        className="w-72"
        interactive
        selected
        render={<button type="button" />}
        title="Chief of staff"
        description="Morning brief is ready."
      />
    </Backdrop>
  );
}
