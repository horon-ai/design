import { IconButton } from "@horon-ai/react";
import { DotsThree, MagnifyingGlass, Plus } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function IconButtonDemo() {
  return (
    <Backdrop className="flex-col gap-3!">
      <div className="flex items-center gap-3">
        <IconButton size="sm" icon={<Plus />} label="Add small" variant="primary" />
        <IconButton icon={<Plus />} label="Add" variant="primary" />
        <IconButton size="lg" icon={<Plus />} label="Add large" variant="primary" />
      </div>
      <div className="flex items-center gap-3">
        <IconButton icon={<Plus />} label="Add" variant="primary" />
        <IconButton icon={<DotsThree />} label="More" />
        <IconButton icon={<MagnifyingGlass />} label="Search" variant="glass" />
        <IconButton icon={<MagnifyingGlass />} label="Search" variant="solid" />
      </div>
    </Backdrop>
  );
}
