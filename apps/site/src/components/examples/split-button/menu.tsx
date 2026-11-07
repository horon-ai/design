import { MenuItem, MenuSeparator, SplitButton } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

export default function SplitButtonMenu() {
  return (
    <SplitButton
      icon={<Plus />}
      menuLabel="Add options"
      menu={
        <>
          <MenuItem>Add from template</MenuItem>
          <MenuItem>Import from file</MenuItem>
          <MenuSeparator />
          <MenuItem>Add manually</MenuItem>
        </>
      }
    >
      Add
    </SplitButton>
  );
}
