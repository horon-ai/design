import { IconButton } from "@horon-ai/react";
import { ArrowsClockwise, DotsThree, MagnifyingGlass, Plus } from "@phosphor-icons/react";

export default function IconButtonToolbar() {
  return (
    <div className="flex w-full max-w-80 items-center justify-between gap-3 rounded-lg border border-border-default bg-bg-surface px-3 py-2">
      <div className="flex items-center gap-1">
        <IconButton icon={<ArrowsClockwise />} label="Refresh the list" />
        <IconButton icon={<MagnifyingGlass />} label="Search bots" />
      </div>
      <div className="flex items-center gap-1">
        <IconButton variant="quiet" icon={<DotsThree />} label="More actions" />
        <IconButton variant="primary" icon={<Plus />} label="New bot" />
      </div>
    </div>
  );
}
