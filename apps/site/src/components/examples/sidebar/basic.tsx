import {
  HoronIcon,
  HoronWordmark,
  Sidebar,
  SidebarAccount,
  SidebarHeader,
  SidebarItem,
  SidebarSpacer,
} from "@horon-ai/react";
import { Bell, CalendarDots, Files, Repeat } from "@phosphor-icons/react";

export default function SidebarBasic() {
  return (
    <div className="flex w-full">
      <Sidebar className="h-120">
        <SidebarHeader initial="H" name="Horon HQ" onCollapse={() => undefined} />
        <SidebarItem icon={<HoronIcon />} current aria-label="Home">
          <HoronWordmark height={9.6} />
        </SidebarItem>
        <SidebarItem icon={<Bell />} count={12} attention>
          Inbox
        </SidebarItem>
        <SidebarItem icon={<Files />}>Artifacts</SidebarItem>
        <SidebarItem icon={<CalendarDots />}>Schedule</SidebarItem>
        <SidebarItem icon={<Repeat />}>Routines</SidebarItem>
        <SidebarSpacer />
        <SidebarAccount initials="AL" name="Alpox" email="alpoxdev@gmail.com" />
      </Sidebar>
    </div>
  );
}
