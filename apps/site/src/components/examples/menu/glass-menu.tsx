import { Button, Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "@horon-ai/react";
import { GearSix, SignOut, User } from "@phosphor-icons/react";

import { Backdrop } from "../../demo-backdrop";

export default function MenuGlass() {
  return (
    <Backdrop>
      <Menu>
        <MenuTrigger render={<Button variant="glass" />}>Account</MenuTrigger>
        <MenuContent surface="glass">
          <MenuLabel>mina@horon.ai</MenuLabel>
          <MenuItem icon={<User />}>Profile</MenuItem>
          <MenuItem icon={<GearSix />}>Settings</MenuItem>
          <MenuSeparator />
          <MenuItem icon={<SignOut />}>Sign out</MenuItem>
        </MenuContent>
      </Menu>
    </Backdrop>
  );
}
