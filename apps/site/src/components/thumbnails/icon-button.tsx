import { IconButton } from "@horon-ai/react";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";

export default function IconButtonThumbnail() {
  return (
    <div className="flex items-center gap-4">
      <IconButton variant="primary" icon={<Plus />} label="New bot" />
      <IconButton variant="solid" icon={<MagnifyingGlass />} label="Search" />
    </div>
  );
}
