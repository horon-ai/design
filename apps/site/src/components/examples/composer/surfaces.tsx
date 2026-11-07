import { Composer } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function ComposerSurfaces() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Composer surface="solid" className="w-full max-w-97.5" placeholder="Ask Chief of staff" />
      <Backdrop className="flex-col">
        <Composer surface="glass" className="w-full max-w-97.5" placeholder="Ask Chief of staff" />
      </Backdrop>
    </div>
  );
}
