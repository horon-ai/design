import { MenuItem, MenuSeparator, SplitButton } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function SplitButtonDemo() {
  return (
    <Backdrop>
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
      <SplitButton disabled icon={<Plus />}>
        Disabled
      </SplitButton>
    </Backdrop>
  );
}
