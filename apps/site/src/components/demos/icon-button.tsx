import { IconButton } from "@horon-ai/react";
import { DotsThree, MagnifyingGlass, Plus } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function IconButtonDemo() {
  return (
    <Backdrop className="gap-3!">
      <IconButton icon={<Plus />} label="Add" variant="primary" />
      <IconButton icon={<DotsThree />} label="More" />
      <IconButton icon={<MagnifyingGlass />} label="Search" variant="glass" />
    </Backdrop>
  );
}
