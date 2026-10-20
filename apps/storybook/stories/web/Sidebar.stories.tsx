import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@horon-ai/react/components/sidebar";
import { BellIcon, CircleHelpIcon, HomeIcon, SettingsIcon, UsersIcon } from "lucide-react";

const meta = {
  title: "Web/Sidebar",
  component: Sidebar,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

function Brand() {
  return (
    <span className="flex min-w-0 items-center gap-2 overflow-hidden group-data-[state=collapsed]/sidebar:hidden">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] font-semibold text-primary-foreground">
        H
      </span>
      <span className="truncate text-sm font-semibold text-foreground">Horon</span>
    </span>
  );
}

export const Playground: Story = {
  render: () => (
    <div className="flex h-[440px] w-[760px] overflow-hidden rounded-lg border border-border bg-background">
      <Sidebar>
        <SidebarHeader className="justify-between">
          <Brand />
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenuItem>
              <SidebarMenuButton active>
                <HomeIcon />
                <span>Overview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <UsersIcon />
                <span>Members</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <BellIcon />
                <span>Notifications</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <SettingsIcon />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <CircleHelpIcon />
                <span>Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton>
            <SettingsIcon />
            <span>Workspace</span>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center border-b border-border px-4">
          <span className="text-sm font-medium text-foreground">Overview</span>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-6">
          <h1 className="text-lg font-semibold text-foreground">Overview</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Press the trigger in the rail header. The rail collapses, the labels hide, and the icons stay centered.
          </p>
        </div>
      </SidebarInset>
    </div>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <div className="flex h-[440px] w-[760px] overflow-hidden rounded-lg border border-border bg-background">
      <Sidebar defaultOpen={false}>
        <SidebarHeader className="justify-between">
          <Brand />
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenuItem>
              <SidebarMenuButton active aria-label="Overview">
                <HomeIcon />
                <span>Overview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton aria-label="Members">
                <UsersIcon />
                <span>Members</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton aria-label="Notifications">
                <BellIcon />
                <span>Notifications</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center border-b border-border px-4">
          <span className="text-sm font-medium text-foreground">Overview</span>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-6">
          <h1 className="text-lg font-semibold text-foreground">Collapsed rail</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Started with defaultOpen false. The trigger expands it again.
          </p>
        </div>
      </SidebarInset>
    </div>
  ),
};
