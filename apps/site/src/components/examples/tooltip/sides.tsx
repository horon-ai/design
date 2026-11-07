import { IconButton, Tooltip, TooltipProvider } from "@horon-ai/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "@phosphor-icons/react";

export default function TooltipSides() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Tooltip label="Top" side="top">
          <IconButton icon={<ArrowUp />} label="Top" variant="solid" />
        </Tooltip>
        <Tooltip label="Bottom" side="bottom">
          <IconButton icon={<ArrowDown />} label="Bottom" variant="solid" />
        </Tooltip>
        <Tooltip label="Left" side="left">
          <IconButton icon={<ArrowLeft />} label="Left" variant="solid" />
        </Tooltip>
        <Tooltip label="Right" side="right">
          <IconButton icon={<ArrowRight />} label="Right" variant="solid" />
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
