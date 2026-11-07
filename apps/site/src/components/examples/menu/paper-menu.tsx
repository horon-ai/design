import { Button, Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTile, MenuTrigger } from "@horon-ai/react";
import { Check, GearSix, PlusCircle } from "@phosphor-icons/react";

export default function MenuPaper() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="solid" />}>Switch workspace</MenuTrigger>
      <MenuContent surface="paper">
        <MenuLabel>Workspaces</MenuLabel>
        <MenuItem icon={<MenuTile>H</MenuTile>} description="12 members" selected trailing={<Check weight="bold" />}>
          Horon HQ
        </MenuItem>
        <MenuItem icon={<MenuTile>L</MenuTile>} description="4 members">
          Horon Labs
        </MenuItem>
        <MenuItem icon={<MenuTile>P</MenuTile>} description="Just you">
          Personal
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={<PlusCircle />}>New workspace</MenuItem>
        <MenuItem icon={<GearSix />}>Workspace settings</MenuItem>
      </MenuContent>
    </Menu>
  );
}
