import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HoronIcon,
  HoronWordmark,
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
  Sidebar,
  SidebarAccount,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProjectTile,
  SidebarSpacer,
  SidebarTree,
} from "@horon-ai/react";
import {
  Bell,
  CalendarBlank,
  Check,
  Cube,
  Drop,
  EnvelopeSimple,
  GearSix,
  MagnifyingGlass,
  Question,
  SignOut,
  Sparkle,
  User,
  UserPlus,
} from "@phosphor-icons/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/Sidebar",
  component: Sidebar,
  decorators: [onBackdrop],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sidebar className="h-190">
      <SidebarHeader initial="H" name="Horon HQ" onCollapse={() => undefined} />
      <SidebarItem icon={<HoronIcon />} current aria-label="Horon">
        <HoronWordmark />
      </SidebarItem>
      <SidebarItem icon={<Bell />} count={12}>
        Inbox
      </SidebarItem>
      <SidebarItem icon={<Cube />}>Artifacts</SidebarItem>
      <SidebarItem icon={<MagnifyingGlass />}>Search</SidebarItem>
      <SidebarGroup label="Routines">
        <SidebarItem icon={<CalendarBlank />}>All routines</SidebarItem>
        <SidebarTree>
          <SidebarItem icon={<Sparkle />} count={3}>
            Morning brief
          </SidebarItem>
          <SidebarItem icon={<EnvelopeSimple />} count={8}>
            Inbox triage
          </SidebarItem>
          <SidebarItem icon={<Bell />} count={1}>
            Weekly report
          </SidebarItem>
        </SidebarTree>
      </SidebarGroup>
      <SidebarGroup label="Projects">
        <SidebarItem
          icon={
            <SidebarProjectTile className="bg-sky-500">
              <User />
            </SidebarProjectTile>
          }
          attention
        >
          Q4 hiring
        </SidebarItem>
        <SidebarItem
          icon={
            <SidebarProjectTile>
              <EnvelopeSimple />
            </SidebarProjectTile>
          }
        >
          Investor update
        </SidebarItem>
        <SidebarItem
          icon={
            <SidebarProjectTile className="bg-sky-700">
              <Check />
            </SidebarProjectTile>
          }
        >
          Launch checklist
        </SidebarItem>
      </SidebarGroup>
      <SidebarSpacer />
      <Menu>
        <MenuTrigger render={<SidebarAccount initials="AL" name="Alpox" email="alpoxdev@gmail.com" />} />
        <MenuContent surface="solid" side="top" className="w-64">
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
    </Sidebar>
  ),
};
