import { IconButton, Tooltip, TooltipProvider } from "@horon-ai/react";
import { Copy } from "@phosphor-icons/react";

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip label="Copy">
        <IconButton icon={<Copy />} label="Copy" />
      </Tooltip>
    </TooltipProvider>
  );
}
