import {
  HoronIcon,
  HoronWordmark,
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
  EnvelopeSimple,
  MagnifyingGlass,
  Sparkle,
  User,
} from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function SidebarDemo() {
  return (
    <Backdrop>
      <Sidebar className="h-160">
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
              <SidebarProjectTile className="bg-sky-700">
                <Check />
              </SidebarProjectTile>
            }
          >
            Launch checklist
          </SidebarItem>
        </SidebarGroup>
        <SidebarSpacer />
        <SidebarAccount initials="AL" name="Alpox" email="alpoxdev@gmail.com" />
      </Sidebar>
    </Backdrop>
  );
}
