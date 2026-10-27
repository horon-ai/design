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
  SidebarAddButton,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProject,
  SidebarProjectMore,
  SidebarProjectTile,
  SidebarSpacer,
  SidebarWorkspaceSwitch,
  WorkspaceMenu,
} from "@horon-ai/react";
import {
  Archive,
  Bell,
  ChartLineUp,
  ChatCircle,
  ClipboardText,
  Code,
  Copy,
  Cube,
  Drop,
  FileText,
  Flask,
  GearSix,
  MagnifyingGlass,
  Megaphone,
  PenNib,
  PencilSimple,
  Question,
  Repeat,
  SignOut,
  Trash,
  UserPlus,
  UsersThree,
} from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";

import { Backdrop } from "../demo-backdrop";

const workspaces = [
  { id: "hq", name: "Horon HQ", meta: "12 members" },
  { id: "labs", name: "Horon Labs", meta: "4 members" },
  { id: "personal", name: "Personal", meta: "Just you" },
];

const projects: { name: string; icon: ReactNode; tile?: string; children?: { icon: ReactNode; name: string }[] }[] = [
  {
    name: "Horon app",
    icon: <Code />,
    tile: "bg-sky-500",
    children: [
      { icon: <ChatCircle />, name: "API rate limits" },
      { icon: <FileText />, name: "Release notes v0.4" },
      { icon: <ChatCircle />, name: "Bug triage" },
    ],
  },
  { name: "Q4 roadmap", icon: <ClipboardText /> },
  { name: "Launch campaign", icon: <Megaphone />, tile: "bg-sky-700" },
  { name: "Brand refresh", icon: <PenNib />, tile: "bg-sky-500" },
  { name: "Investor update", icon: <ChartLineUp /> },
  { name: "User research", icon: <Flask />, tile: "bg-sky-700" },
  { name: "Q4 hiring", icon: <UsersThree />, tile: "bg-sky-500" },
];

/** Figma `Project menu` (314:9199): the row's width, 5px under the row (13px under the 16px More button). */
function ProjectMenu() {
  return (
    <Menu>
      <MenuTrigger render={<SidebarProjectMore />} />
      <MenuContent surface="solid" align="end" alignOffset={-10} sideOffset={13} className="w-64">
        <MenuItem icon={<PencilSimple />}>Rename</MenuItem>
        <MenuItem icon={<GearSix />}>Project settings</MenuItem>
        <MenuItem icon={<Copy />}>Duplicate</MenuItem>
        <MenuItem icon={<Archive />}>Archive</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash />} danger>
          Delete project
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}

export default function SidebarDemo() {
  const [workspace, setWorkspace] = useState("hq");
  const current = workspaces.find((item) => item.id === workspace) ?? workspaces[0];
  return (
    <Backdrop>
      {/* Left-aligned so the right edge follows the pointer while resizing. */}
      <div className="flex w-full">
        <Sidebar resizable className="h-190">
          <SidebarHeader
            initial={current.name.charAt(0)}
            name={current.name}
            switchSlot={
              <WorkspaceMenu
                workspaces={workspaces}
                value={workspace}
                onValueChange={setWorkspace}
                trigger={<SidebarWorkspaceSwitch initial={current.name.charAt(0)} name={current.name} />}
              />
            }
          />
          <SidebarItem icon={<HoronIcon />} current aria-label="Horon">
            <HoronWordmark height={9.6} />
          </SidebarItem>
          <SidebarItem icon={<Bell />} count={12}>
            Inbox
          </SidebarItem>
          <SidebarItem icon={<Cube />}>Artifacts</SidebarItem>
          <SidebarItem icon={<Repeat />}>Routines</SidebarItem>
          <SidebarItem icon={<MagnifyingGlass />}>Search</SidebarItem>
          <SidebarGroup label="Projects">
            {projects.map((project) => (
              <SidebarProject
                key={project.name}
                defaultOpen={project.children !== undefined}
                icon={<SidebarProjectTile className={project.tile}>{project.icon}</SidebarProjectTile>}
                label={project.name}
                actions={<ProjectMenu />}
              >
                {(project.children ?? [{ icon: <ChatCircle />, name: "Kickoff notes" }]).map((child) => (
                  <SidebarItem key={child.name} icon={child.icon}>
                    {child.name}
                  </SidebarItem>
                ))}
              </SidebarProject>
            ))}
          </SidebarGroup>
          <SidebarAddButton>Add project</SidebarAddButton>
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
      </div>
    </Backdrop>
  );
}
