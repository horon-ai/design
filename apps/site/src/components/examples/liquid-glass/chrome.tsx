import { Button, LiquidGlass } from "@horon-ai/react";
import { ArrowRight, ArrowsClockwise, ShareNetwork } from "@phosphor-icons/react";

import { Backdrop } from "../../demo-backdrop";

export default function LiquidGlassChrome() {
  return (
    <Backdrop className="flex-col">
      <div className="relative isolate w-full max-w-140 overflow-clip rounded-xl bg-glass-thick px-4 py-3">
        <LiquidGlass />
        <div className="relative flex flex-wrap items-center gap-3">
          <span className="flex min-w-0 flex-col">
            <span className="text-label-md text-text-primary">Quarterly plan</span>
            <span className="text-caption text-text-secondary">3 bots · 1 workspace</span>
          </span>
          <span className="flex-1" />
          <Button variant="glass" size="sm" icon={<ShareNetwork />}>
            Share
          </Button>
          <Button variant="glass" size="sm" icon={<ArrowsClockwise />}>
            Sync
          </Button>
          <Button variant="glass" size="sm" icon={<ArrowRight />}>
            Open
          </Button>
        </div>
      </div>
    </Backdrop>
  );
}
