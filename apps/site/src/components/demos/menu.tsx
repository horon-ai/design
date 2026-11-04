import { Button, Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "@horon-ai/react";
import { Copy, Gear, Paperclip, SignOut, Sparkle, Trash, User } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

type Surface = "solid" | "glass";

function ActionsMenu({ surface }: { surface: Surface }) {
  return (
    <Menu>
      <MenuTrigger render={<Button variant={surface === "glass" ? "glass" : "solid"} />}>Message actions</MenuTrigger>
      <MenuContent surface={surface}>
        <MenuItem icon={<Copy />} trailing="⌘C">
          Copy
        </MenuItem>
        <MenuItem icon={<Sparkle />}>Regenerate</MenuItem>
        <MenuItem icon={<Paperclip />}>Attach file</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash />} danger>
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}

function AccountMenu({ surface }: { surface: Surface }) {
  return (
    <Menu>
      <MenuTrigger render={<Button variant={surface === "glass" ? "glass" : "solid"} />}>Account</MenuTrigger>
      <MenuContent surface={surface}>
        <MenuLabel>mina@horon.ai</MenuLabel>
        <MenuItem icon={<User />}>Profile</MenuItem>
        <MenuItem icon={<Gear />}>Settings</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<SignOut />}>Sign out</MenuItem>
      </MenuContent>
    </Menu>
  );
}

export default function MenuDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full flex-wrap items-center justify-center gap-3">
          <ActionsMenu surface="solid" />
          <AccountMenu surface="solid" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop>
          <ActionsMenu surface="glass" />
          <AccountMenu surface="glass" />
        </Backdrop>
      </div>
    </div>
  );
}
