import { Sidebar, SidebarHeader, SidebarItem } from "@horon-ai/react";
import { Bell, Files, MagnifyingGlass } from "@phosphor-icons/react";

export default function SidebarThumbnail() {
  return (
    <Sidebar>
      <SidebarHeader initial="H" name="Horon HQ" />
      <SidebarItem icon={<Bell />} count={12} current>
        Inbox
      </SidebarItem>
      <SidebarItem icon={<Files />}>Artifacts</SidebarItem>
      <SidebarItem icon={<MagnifyingGlass />}>Search</SidebarItem>
    </Sidebar>
  );
}
