import { MenuItem, MenuSeparator, SplitButton } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

export default function SplitButtonThumbnail() {
  return (
    <SplitButton
      icon={<Plus />}
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
