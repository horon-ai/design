import { Composer } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-3">
        <Composer surface={surface} className="max-w-72 max-md:max-w-full" size="sm" placeholder="Small" />
        <Composer surface={surface} className="max-w-72 max-md:max-w-full" placeholder="Medium" />
        <Composer surface={surface} className="max-w-72 max-md:max-w-full" size="lg" placeholder="Large" />
      </div>
      <Composer surface={surface} className="w-full max-w-97.5" placeholder="Ask Chief of staff" />
      <Composer
        surface={surface}
        className="w-full max-w-97.5"
        placeholder="Ask Chief of staff"
        defaultValue="Add a slide for headcount"
      />
    </div>
  );
}

export default function ComposerDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-4">
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
