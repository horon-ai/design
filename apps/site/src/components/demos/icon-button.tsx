import { IconButton } from "@horon-ai/react";
import { Copy, MagnifyingGlass, Plus } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function IconButtonDemo() {
  return (
    <Backdrop>
      <IconButton icon={<Plus />} label="Add" variant="primary" />
      <IconButton icon={<MagnifyingGlass />} label="Search" variant="glass" />
      <IconButton icon={<Copy />} label="Copy" />
    </Backdrop>
  );
}
