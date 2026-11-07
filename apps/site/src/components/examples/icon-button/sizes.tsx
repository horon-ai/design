import { IconButton } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

export default function IconButtonSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <IconButton size="sm" icon={<Plus />} label="Add small" />
      <IconButton size="md" icon={<Plus />} label="Add" />
      <IconButton size="lg" icon={<Plus />} label="Add large" />
    </div>
  );
}
