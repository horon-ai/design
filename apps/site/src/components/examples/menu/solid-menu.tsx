import { Button, Kbd, Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@horon-ai/react";
import { ArrowClockwise, Copy, Paperclip, Trash } from "@phosphor-icons/react";

export default function MenuSolid() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="solid" />}>Message actions</MenuTrigger>
      <MenuContent>
        <MenuItem icon={<Copy />} trailing={<Kbd keys="Mod+C" />}>
          Copy
        </MenuItem>
        <MenuItem icon={<ArrowClockwise />}>Regenerate</MenuItem>
        <MenuItem icon={<Paperclip />}>Attach file</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash />} danger>
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
