import { Composer } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function ComposerDemo() {
  return (
    <Backdrop className="flex-col">
      <div className="flex flex-wrap items-start gap-3">
        <Composer surface="glass" className="max-w-72" size="sm" placeholder="Small" />
        <Composer surface="glass" className="max-w-72" placeholder="Medium" />
        <Composer surface="glass" className="max-w-72" size="lg" placeholder="Large" />
      </div>
      <Composer surface="glass" className="w-97.5" placeholder="Ask Chief of staff" />
      <Composer
        surface="glass"
        className="w-97.5"
        placeholder="Ask Chief of staff"
        defaultValue="Add a slide for headcount"
      />
      <Composer className="w-97.5" placeholder="Ask Chief of staff" />
    </Backdrop>
  );
}
