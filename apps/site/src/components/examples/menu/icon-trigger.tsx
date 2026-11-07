import { IconButton, Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@horon-ai/react";
import { Copy, DotsThree, DownloadSimple, Trash } from "@phosphor-icons/react";

export default function MenuIconTrigger() {
  return (
    <Menu>
      <MenuTrigger render={<IconButton icon={<DotsThree />} label="More actions" variant="ghost" />} />
      <MenuContent align="end">
        <MenuItem icon={<Copy />}>Copy link</MenuItem>
        <MenuItem icon={<DownloadSimple />}>Download</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash />} danger>
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
