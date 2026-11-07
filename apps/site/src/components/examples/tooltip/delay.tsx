import { IconButton, Tooltip, TooltipProvider } from "@horon-ai/react";
import { Copy, Scissors } from "@phosphor-icons/react";

export default function TooltipDelay() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Tooltip label="Copy" delay={0}>
          <IconButton icon={<Copy />} label="Copy" variant="solid" />
        </Tooltip>
        <Tooltip label="Cut" delay={500}>
          <IconButton icon={<Scissors />} label="Cut" variant="solid" />
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
