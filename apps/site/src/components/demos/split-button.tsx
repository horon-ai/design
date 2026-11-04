import { MenuItem, MenuSeparator, SplitButton } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

const menu = (
  <>
    <MenuItem>Add from template</MenuItem>
    <MenuItem>Import from file</MenuItem>
    <MenuSeparator />
    <MenuItem>Add manually</MenuItem>
  </>
);

export default function SplitButtonDemo() {
  return (
    <Backdrop>
      <SplitButton icon={<Plus />} menu={menu}>
        Add
      </SplitButton>
      {/* Without a menu there is no caret half: the pill is one button. */}
      <SplitButton icon={<Plus />}>Deploy</SplitButton>
      <SplitButton disabled icon={<Plus />} menu={menu}>
        Disabled
      </SplitButton>
    </Backdrop>
  );
}
