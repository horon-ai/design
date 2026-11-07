import { IconButton } from "@horon-ai/react";
import { PaperPlaneTilt, Plus, Trash } from "@phosphor-icons/react";

export default function IconButtonDisabled() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <IconButton variant="primary" disabled icon={<Plus />} label="New bot" />
      <IconButton variant="solid" disabled icon={<PaperPlaneTilt />} label="Send" />
      <IconButton variant="ghost" disabled icon={<Trash />} label="Delete" />
    </div>
  );
}
