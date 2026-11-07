import { useState } from "@lynx-js/react";

import { HoronIcon } from "../../src/components/horon-icon";
import { HoronWordmark } from "../../src/components/horon-wordmark";
import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "../../src/components/menu";
import {
  Sidebar,
  SidebarAccount,
  SidebarAddButton,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProject,
  SidebarProjectMore,
  SidebarProjectTile,
  SidebarSpacer,
} from "../../src/components/sidebar";
import { WorkspaceMenu } from "../../src/components/workspace-menu";
import { Icon, type IconName } from "../../src/icons";
import { Backdrop } from "./backdrop";

const workspaces = [
  { id: "hq", name: "Horon HQ", meta: "12 members" },
  { id: "labs", name: "Horon Labs", meta: "4 members" },
  { id: "personal", name: "Personal", meta: "Just you" },
];

const projects: { name: string; icon: IconName; tile?: string; children?: { icon: IconName; name: string }[] }[] = [
  {
    name: "Horon app",
    icon: "Code",
    tile: "bg-sky-500",
    children: [
      { icon: "ChatCircle", name: "API rate limits" },
      { icon: "FileText", name: "Release notes v0.4" },
      { icon: "ChatCircle", name: "Bug triage" },
    ],
  },
  { name: "Q4 roadmap", icon: "ClipboardText" },
  { name: "Launch campaign", icon: "Megaphone", tile: "bg-sky-700" },
  { name: "Brand refresh", icon: "PenNib", tile: "bg-sky-500" },
  { name: "Investor update", icon: "ChartLineUp" },
  { name: "User research", icon: "Flask", tile: "bg-sky-700" },
  { name: "Q4 hiring", icon: "UsersThree", tile: "bg-sky-500" },
];

/**
 * One sidebar with a live workspace switcher, a collapsible project, the add
 * button and the account row, then the same column on the Paper photo surface.
 *
 * React's demo opened a per-project menu trigger through `render`; Lynx has no
 * element swapping, so the "More" button is a plain row and the account menu is
 * the only popup here. The collapse button hides the column, which react's demo
 * did through the page's own sidebar state.
 */
export default function SidebarDemo() {
  const [workspace, setWorkspace] = useState("hq");
  const [open, setOpen] = useState("Horon app");
  const [collapsed, setCollapsed] = useState(false);
  const current = workspaces.find((item) => item.id === workspace) ?? workspaces[0];

  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <Backdrop>
        {/* react's demo used a full-width row so the column hugs the left edge of the sky. */}
        <view className="flex w-full flex-row items-start">
        {collapsed ? (
          <view
            className="flex flex-row items-center rounded-md border border-border-default bg-bg-surface px-3 py-2"
            bindtap={() => setCollapsed(false)}
            accessibility-element
            accessibility-traits="button"
            accessibility-label="Expand sidebar"
          >
            <text className="text-label-md text-text-primary">expand sidebar</text>
          </view>
        ) : (
          <Sidebar resizable className="h-[900px]" onWidthChange={() => undefined}>
            <SidebarHeader
              initial={current.name.charAt(0)}
              name={current.name}
              onCollapse={() => setCollapsed(true)}
              switchSlot={
                <WorkspaceMenu
                  workspaces={workspaces}
                  value={workspace}
                  onValueChange={setWorkspace}
                  trigger={
                    <view className="flex size-7 shrink-0 flex-row items-center justify-center rounded-sm bg-interactive-primary">
                      <text className="text-label-md text-text-inverse">{current.name.charAt(0)}</text>
                    </view>
                  }
                  triggerChildren={
                    <view className="flex min-w-0 flex-1 flex-row items-center gap-1.5">
                      <text className="min-w-0 flex-1 truncate text-label-lg text-text-primary">{current.name}</text>
                      <Icon name="CaretUpDown" size={14} color="text-secondary" />
                    </view>
                  }
                  triggerClassName="min-w-0 flex-1 gap-1.5 pr-1 pl-2"
                />
              }
            />
            <SidebarItem icon={<HoronIcon size={18} color="text-primary" />} current aria-label="Horon">
              <HoronWordmark height={9.6} color="text-primary" />
            </SidebarItem>
            <SidebarItem
              icon={<Icon name="Bell" size={18} color="text-secondary" />}
              count={12}
              onClick={() => undefined}
            >
              Inbox
            </SidebarItem>
            <SidebarItem icon={<Icon name="Files" size={18} color="text-secondary" />}>Artifacts</SidebarItem>
            <SidebarItem icon={<Icon name="CalendarDots" size={18} color="text-secondary" />}>Schedule</SidebarItem>
            <SidebarItem icon={<Icon name="Repeat" size={18} color="text-secondary" />}>Routines</SidebarItem>
            <SidebarItem icon={<Icon name="TreeStructure" size={18} color="text-secondary" />}>Workflows</SidebarItem>
            <SidebarItem icon={<Icon name="MagnifyingGlass" size={18} color="text-secondary" />}>Search</SidebarItem>

            <SidebarGroup label="Projects">
              {projects.map((project) => (
                <SidebarProject
                  key={project.name}
                  icon={
                    <SidebarProjectTile className={project.tile}>
                      <Icon name={project.icon} size={14} color="interactive-on-primary" />
                    </SidebarProjectTile>
                  }
                  label={project.name}
                  open={open === project.name}
                  onOpenChange={(next) => setOpen(next ? project.name : "")}
                  actions={<SidebarProjectMore onClick={() => undefined} />}
                >
                  {(project.children ?? [{ icon: "ChatCircle", name: "Kickoff notes" }]).map((child) => (
                    <SidebarItem key={child.name} icon={<Icon name={child.icon} size={16} color="text-secondary" />}>
                      {child.name}
                    </SidebarItem>
                  ))}
                </SidebarProject>
              ))}
            </SidebarGroup>
            <SidebarAddButton onClick={() => undefined}>Add project</SidebarAddButton>
            <SidebarSpacer />
            <Menu>
              <MenuTrigger>
                <SidebarAccount initials="AL" name="Alpox" email="alpoxdev@gmail.com" />
              </MenuTrigger>
              <MenuContent surface="solid" side="top" className="w-64">
                <MenuLabel>alpoxdev@gmail.com</MenuLabel>
                <MenuItem icon={<Icon name="GearSix" size={18} color="text-primary" />}>Settings</MenuItem>
                <MenuItem icon={<Icon name="Drop" size={18} color="text-primary" />}>Usage</MenuItem>
                <MenuSeparator />
                <MenuItem icon={<Icon name="SignOut" size={18} color="text-primary" />}>Log out</MenuItem>
              </MenuContent>
            </Menu>
          </Sidebar>
        )}
        </view>
      </Backdrop>
      {/* The Paper surface: the Horon photo under a white veil, kept for the light scheme. */}
      <Backdrop>
        <Sidebar surface="photo" resizable className="h-[420px]">
          <SidebarHeader initial="P" name="Photo surface" />
          <SidebarItem icon={<Icon name="Bell" size={18} color="text-secondary" />} current>
            Inbox
          </SidebarItem>
          <SidebarItem icon={<Icon name="Files" size={18} color="text-secondary" />}>Artifacts</SidebarItem>
          <SidebarItem icon={<Icon name="ChatCircle" size={18} color="text-secondary" />} attention>
            Unread thread
          </SidebarItem>
          <SidebarSpacer />
          <SidebarAccount initials="AL" name="Alpox" email="alpoxdev@gmail.com" />
        </Sidebar>
        <Sidebar surface="plain" className="h-[420px]">
          <SidebarHeader initial="N" name="Plain surface" />
          <SidebarItem icon={<Icon name="Files" size={18} color="text-secondary" />} current>
            Artifacts
          </SidebarItem>
          <SidebarItem icon={<Icon name="Repeat" size={18} color="text-secondary" />} count={2}>
            Routines
          </SidebarItem>
          <SidebarSpacer />
        </Sidebar>
      </Backdrop>
    </view>
  );
}
