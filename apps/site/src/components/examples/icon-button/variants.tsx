import { IconButton } from "@horon-ai/react";
import { ArrowsClockwise, DotsThree, Gear, Plus, Share } from "@phosphor-icons/react";

import { Backdrop } from "../../demo-backdrop";

export default function IconButtonVariants() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <IconButton variant="ghost" icon={<Gear />} label="Settings" />
        <IconButton variant="primary" icon={<Plus />} label="New bot" />
        <IconButton variant="solid" icon={<Share />} label="Share" />
        <IconButton variant="quiet" icon={<DotsThree />} label="More" />
      </div>
      <Backdrop className="justify-between">
        <span className="text-body-sm text-text-primary">Agent workspace</span>
        <div className="flex items-center gap-2">
          <IconButton variant="glass" icon={<ArrowsClockwise />} label="Refresh" />
          <IconButton variant="glass" icon={<DotsThree />} label="More" />
        </div>
      </Backdrop>
    </div>
  );
}
