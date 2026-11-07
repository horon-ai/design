import { useState } from "@lynx-js/react";

import { Composer } from "../../src/components/composer";
import { Backdrop } from "./backdrop";

/** The composer at each rung and surface, with the sent text shown below. */
function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex w-full flex-col items-center gap-3">
      <view className="flex w-full min-w-0 flex-row flex-wrap items-center justify-center gap-3">
        <Composer surface={surface} className="max-w-[288px]" size="sm" placeholder="Small" />
        <Composer surface={surface} className="max-w-[288px]" placeholder="Medium" />
        <Composer surface={surface} className="max-w-[288px]" size="lg" placeholder="Large" />
      </view>
      <Composer surface={surface} className="w-full max-w-[390px]" placeholder="Ask Chief of staff" />
    </view>
  );
}

/** A live composer that records what it sent. */
export default function ComposerDemo() {
  const [sent, setSent] = useState<string[]>([]);
  return (
    <view className="flex w-full flex-col gap-6">
      <view className="flex w-full flex-col gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <Examples surface="solid" />
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <Examples surface="glass" />
      </Backdrop>
      <view className="flex w-full flex-col items-center gap-3">
        <Composer
          className="w-full max-w-[390px]"
          placeholder="Ask Chief of staff"
          defaultValue="Add a slide for headcount"
          onSubmit={(text) => setSent((list) => [...list, text])}
        />
        <text className="text-caption text-text-secondary">{`sent: ${sent.join(" · ") || "nothing yet"}`}</text>
      </view>
    </view>
  );
}
