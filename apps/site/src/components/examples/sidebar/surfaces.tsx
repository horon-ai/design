import { Sidebar, SidebarHeader, SidebarItem } from "@horon-ai/react";
import { Bell, Files, House } from "@phosphor-icons/react";

import { Backdrop } from "../../demo-backdrop";

function Column({ surface }: { surface: "glass" | "photo" | "plain" }) {
  return (
    <Sidebar className="h-96" surface={surface}>
      <SidebarHeader initial="H" name="Horon HQ" />
      <SidebarItem icon={<House />} current>
        Home
      </SidebarItem>
      <SidebarItem icon={<Bell />} count={3}>
        Inbox
      </SidebarItem>
      <SidebarItem icon={<Files />}>Artifacts</SidebarItem>
    </Sidebar>
  );
}

export default function SidebarSurfaces() {
  return (
    <Backdrop className="items-start gap-4">
      <Column surface="glass" />
      <Column surface="photo" />
      <Column surface="plain" />
    </Backdrop>
  );
}
