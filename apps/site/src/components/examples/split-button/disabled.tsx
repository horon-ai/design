import { MenuItem, SplitButton } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

const menu = (
  <>
    <MenuItem>Add from template</MenuItem>
    <MenuItem>Import from file</MenuItem>
  </>
);

export default function SplitButtonDisabled() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <SplitButton icon={<Plus />} menu={menu}>
        Add
      </SplitButton>
      <SplitButton disabled icon={<Plus />} menu={menu}>
        Add
      </SplitButton>
    </div>
  );
}
