import { Icon } from "../../src/icons";
import { MenuItem, MenuSeparator } from "../../src/components/menu";
import { SplitButton } from "../../src/components/split-button";

import { Backdrop } from "./backdrop";

const menu = (
  <>
    <MenuItem>Add from template</MenuItem>
    <MenuItem>Import from file</MenuItem>
    <MenuSeparator />
    <MenuItem>Add manually</MenuItem>
  </>
);

/** Both halves on a page and on glass, with the menu, without it, and disabled. */
export default function SplitButtonDemo() {
  return (
    <view className="flex w-full flex-col gap-6">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex flex-row flex-wrap items-center justify-center gap-3">
          <SplitButton icon={<Icon name="Plus" size={16} color="interactive-on-primary" />} menu={menu}>
            Add
          </SplitButton>
          {/* Without a menu there is no caret half: the pill is one button. */}
          <SplitButton icon={<Icon name="Plus" size={16} color="interactive-on-primary" />}>Deploy</SplitButton>
          <SplitButton disabled icon={<Icon name="Plus" size={16} color="interactive-on-primary" />} menu={menu}>
            Disabled
          </SplitButton>
        </view>
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">On imagery</text>
        <view className="flex flex-row flex-wrap items-center justify-center gap-3">
          <SplitButton icon={<Icon name="Plus" size={16} color="interactive-on-primary" />} menu={menu}>
            Add
          </SplitButton>
          <SplitButton icon={<Icon name="Plus" size={16} color="interactive-on-primary" />}>Deploy</SplitButton>
        </view>
      </Backdrop>
    </view>
  );
}
