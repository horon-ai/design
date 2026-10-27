import { Button, Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "@horon-ai/react";
import { Copy, Gear, Paperclip, SignOut, Sparkle, Trash, User } from "@phosphor-icons/react";

export default function MenuDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Menu>
        <MenuTrigger render={<Button variant="glass" />}>Message actions</MenuTrigger>
        <MenuContent>
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
      <Menu>
        <MenuTrigger render={<Button variant="glass" />}>Account</MenuTrigger>
        <MenuContent surface="solid">
          <MenuLabel>mina@horon.ai</MenuLabel>
          <MenuItem icon={<User />}>Profile</MenuItem>
          <MenuItem icon={<Gear />}>Settings</MenuItem>
          <MenuSeparator />
          <MenuItem icon={<SignOut />}>Sign out</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  );
}
