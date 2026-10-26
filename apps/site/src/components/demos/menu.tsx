import { Button, Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@horon-ai/react";
import { Copy, Paperclip, Sparkle, Trash } from "@phosphor-icons/react";

export default function MenuDemo() {
  return (
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
  );
}
