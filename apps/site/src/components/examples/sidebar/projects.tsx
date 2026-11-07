import {
  Sidebar,
  SidebarAddButton,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProject,
  SidebarProjectTile,
} from "@horon-ai/react";
import { ClipboardText, ChatCircle, Code, FileText, Megaphone } from "@phosphor-icons/react";

export default function SidebarProjects() {
  return (
    <div className="flex w-full">
      <Sidebar className="h-120">
        <SidebarHeader initial="H" name="Horon HQ" />
        <SidebarGroup label="Projects">
          <SidebarProject
            label="Horon app"
            defaultOpen
            icon={
              <SidebarProjectTile className="bg-sky-500">
                <Code />
              </SidebarProjectTile>
            }
          >
            <SidebarItem icon={<ChatCircle />} current>
              API rate limits
            </SidebarItem>
            <SidebarItem icon={<FileText />}>Release notes v0.4</SidebarItem>
            <SidebarItem icon={<ChatCircle />}>Bug triage</SidebarItem>
          </SidebarProject>
          <SidebarProject
            label="Q4 roadmap"
            icon={
              <SidebarProjectTile>
                <ClipboardText />
              </SidebarProjectTile>
            }
          />
          <SidebarProject
            label="Launch campaign"
            icon={
              <SidebarProjectTile className="bg-sky-700">
                <Megaphone />
              </SidebarProjectTile>
            }
          />
        </SidebarGroup>
        <SidebarAddButton>Add project</SidebarAddButton>
      </Sidebar>
    </div>
  );
}
