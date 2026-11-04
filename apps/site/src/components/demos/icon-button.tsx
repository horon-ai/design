import { IconButton } from "@horon-ai/react";
import { DotsThree, MagnifyingGlass, Plus } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

function Examples({ variant }: { variant: "solid" | "glass" }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <IconButton size="sm" variant={variant} icon={<Plus />} label="Add small" />
        <IconButton variant={variant} icon={<Plus />} label="Add" />
        <IconButton size="lg" variant={variant} icon={<Plus />} label="Add large" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <IconButton icon={<Plus />} label="Add" variant="primary" />
        <IconButton icon={<DotsThree />} label="More" />
        <IconButton icon={<MagnifyingGlass />} label="Search" variant={variant} />
      </div>
    </div>
  );
}

export default function IconButtonDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <Examples variant="solid" />
      </div>
      <Backdrop className="flex-col gap-3!">
        <p className="text-caption text-text-secondary">Glass</p>
        <Examples variant="glass" />
      </Backdrop>
    </div>
  );
}
