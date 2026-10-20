import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@horon-ai/react";

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="outline" />}>저장</TooltipTrigger>
        <TooltipContent>⌘S로 바로 저장합니다</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
