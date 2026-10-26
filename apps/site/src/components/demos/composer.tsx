import { Composer } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function ComposerDemo() {
  return (
    <Backdrop className="flex-col">
      <Composer className="w-97.5" placeholder="Ask Chief of staff" />
      <Composer className="w-97.5" placeholder="Ask Chief of staff" defaultValue="Add a slide for headcount" />
    </Backdrop>
  );
}
