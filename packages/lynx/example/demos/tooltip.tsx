import { useState } from "@lynx-js/react";

import { Icon } from "../../src/icons";
import { Tooltip, TooltipProvider } from "../../src/components/tooltip";

/** A plain 40px icon trigger, the shape React's demo used for its `IconButton`. */
function IconTrigger({ name, label }: { name: "Copy" | "Trash"; label: string }) {
  return (
    <view
      className="relative flex size-10 flex-row items-center justify-center overflow-hidden rounded-full bg-glass-regular"
      accessibility-element
      accessibility-traits="button"
      accessibility-label={label}
    >
      <Icon name={name} size={18} color="text-primary" />
    </view>
  );
}

/**
 * Three tooltips around one provider: tap or long-press the trigger to open the
 * bubble on the requested side.
 */
export default function TooltipDemo() {
  const [copied, setCopied] = useState(false);

  return (
    <TooltipProvider delay={0}>
      <view className="flex w-full flex-col items-center gap-4 p-6">
        <view className="flex flex-row items-center gap-3">
          <Tooltip label="Copy link" side="top">
            <view bindtap={() => setCopied(true)}>
              <IconTrigger name="Copy" label="Copy link" />
            </view>
          </Tooltip>
          <Tooltip label="Delete forever" side="bottom">
            <IconTrigger name="Trash" label="Delete forever" />
          </Tooltip>
        </view>
        <text className="text-caption text-text-secondary">{copied ? "copied" : "tap a trigger"}</text>
      </view>
    </TooltipProvider>
  );
}
