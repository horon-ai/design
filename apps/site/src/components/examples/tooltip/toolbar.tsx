import { IconButton, Tooltip, TooltipProvider } from "@horon-ai/react";
import { ArrowCounterClockwise, ArrowUUpLeft, ArrowUUpRight } from "@phosphor-icons/react";

import { Backdrop } from "../../demo-backdrop";

export default function TooltipToolbar() {
  return (
    <Backdrop>
      <TooltipProvider>
        <div className="flex items-center gap-1">
          <Tooltip label="Undo">
            <IconButton icon={<ArrowUUpLeft />} label="Undo" variant="glass" />
          </Tooltip>
          <Tooltip label="Redo">
            <IconButton icon={<ArrowUUpRight />} label="Redo" variant="glass" />
          </Tooltip>
          <Tooltip label="Reset to the first saved version" side="bottom">
            <IconButton icon={<ArrowCounterClockwise />} label="Reset" variant="glass" />
          </Tooltip>
        </div>
      </TooltipProvider>
    </Backdrop>
  );
}
