import { Sidebar, SidebarHeader, SidebarItem } from "@horon-ai/react";
import { Bell, Files, House, MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";

export default function SidebarResizable() {
  const [width, setWidth] = useState(280);
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full">
        <Sidebar className="h-96" resizable onWidthChange={setWidth}>
          <SidebarHeader initial="H" name="Horon HQ" />
          <SidebarItem icon={<House />} current>
            Home
          </SidebarItem>
          <SidebarItem icon={<Bell />} count={3}>
            Inbox
          </SidebarItem>
          <SidebarItem icon={<Files />}>Artifacts</SidebarItem>
          <SidebarItem icon={<MagnifyingGlass />}>Search</SidebarItem>
        </Sidebar>
      </div>
      <p className="text-caption text-text-secondary">Width: {width}px</p>
    </div>
  );
}
