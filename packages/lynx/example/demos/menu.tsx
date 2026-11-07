import type { ReactNode } from "@lynx-js/react";

import { Icon } from "../../src/icons";
import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "../../src/components/menu";

type Surface = "solid" | "glass";

/** A plain trigger: the label on a surface that matches the popup. */
function Trigger({ surface, children }: { surface: Surface; children: ReactNode }) {
  return (
    <view
      className={
        surface === "glass"
          ? "relative flex flex-row items-center overflow-hidden rounded-full bg-glass-regular px-4 py-2"
          : "flex flex-row items-center rounded-full bg-interactive-primary px-4 py-2"
      }
    >
      <text className={surface === "glass" ? "text-label-md text-text-primary" : "text-label-md text-interactive-on-primary"}>
        {children}
      </text>
    </view>
  );
}

function ActionsMenu({ surface }: { surface: Surface }) {
  return (
    <Menu>
      <MenuTrigger>
        <Trigger surface={surface}>Message actions</Trigger>
      </MenuTrigger>
      <MenuContent surface={surface}>
        <MenuItem icon={<Icon name="Copy" size={18} color={surface === "glass" ? "text-secondary" : "text-primary"} />} trailing="⌘C">
          Copy
        </MenuItem>
        <MenuItem icon={<Icon name="ArrowClockwise" size={18} color={surface === "glass" ? "text-secondary" : "text-primary"} />}>
          Regenerate
        </MenuItem>
        <MenuItem icon={<Icon name="Paperclip" size={18} color={surface === "glass" ? "text-secondary" : "text-primary"} />}>
          Attach file
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Icon name="Trash" size={18} color="text-danger" />} danger>
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}

function AccountMenu({ surface }: { surface: Surface }) {
  return (
    <Menu>
      <MenuTrigger>
        <Trigger surface={surface}>Account</Trigger>
      </MenuTrigger>
      <MenuContent surface={surface}>
        <MenuLabel>mina@horon.ai</MenuLabel>
        <MenuItem icon={<Icon name="User" size={18} color={surface === "glass" ? "text-secondary" : "text-primary"} />}>Profile</MenuItem>
        <MenuItem icon={<Icon name="Gear" size={18} color={surface === "glass" ? "text-secondary" : "text-primary"} />}>Settings</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Icon name="SignOut" size={18} color="text-primary" />}>Sign out</MenuItem>
      </MenuContent>
    </Menu>
  );
}

/** Both surfaces, with one menu per Figma popover: message actions and the account menu. */
export default function MenuDemo() {
  return (
    <view className="flex w-full flex-col gap-6">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex w-full flex-row flex-wrap items-center justify-center gap-3">
          <ActionsMenu surface="solid" />
          <AccountMenu surface="solid" />
        </view>
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <view className="relative flex w-full flex-row flex-wrap items-center justify-center gap-3 overflow-hidden rounded-xl bg-glass-thick p-6">
          <ActionsMenu surface="glass" />
          <AccountMenu surface="glass" />
        </view>
      </view>
    </view>
  );
}
