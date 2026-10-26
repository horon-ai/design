import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTile, MenuTrigger } from "@horon-ai/react";
import {
  Check,
  Copy,
  Drop,
  GearSix,
  Paperclip,
  Plus,
  Question,
  SignOut,
  Sparkle,
  Trash,
  UserPlus,
} from "@phosphor-icons/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/Menu",
  component: Menu,
  decorators: [onBackdrop],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Glass: Story = {
  render: () => (
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
  ),
};

export const Account: Story = {
  render: () => (
    <Menu>
      <MenuTrigger render={<Button variant="glass" />}>Account</MenuTrigger>
      <MenuContent surface="solid" className="w-64">
        <MenuLabel className="pb-1.5 text-body-sm">alpoxdev@gmail.com</MenuLabel>
        <MenuItem icon={<GearSix />} trailing="⌘,">
          Settings
        </MenuItem>
        <MenuItem icon={<Drop />}>Usage</MenuItem>
        <MenuItem icon={<UserPlus />}>Invite friends</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Question />}>Help</MenuItem>
        <MenuItem icon={<SignOut />}>Log out</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const Workspace: Story = {
  render: () => (
    <Menu>
      <MenuTrigger render={<Button variant="glass" />}>Horon HQ</MenuTrigger>
      <MenuContent surface="solid" className="w-64">
        <MenuLabel>Workspaces</MenuLabel>
        <MenuItem icon={<MenuTile>H</MenuTile>} description="3 members" trailing={<Check />}>
          Horon HQ
        </MenuItem>
        <MenuItem icon={<MenuTile className="bg-sky-500">P</MenuTile>} description="Only you">
          Personal
        </MenuItem>
        <MenuItem icon={<MenuTile className="bg-sky-700">A</MenuTile>} description="12 members">
          Acme Labs
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Plus />}>New workspace</MenuItem>
        <MenuItem icon={<GearSix />}>Workspace settings</MenuItem>
      </MenuContent>
    </Menu>
  ),
};
