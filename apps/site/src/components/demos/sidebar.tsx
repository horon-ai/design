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
} from "@horon-ai/react";
import { BellIcon, HomeIcon, SettingsIcon, UsersIcon } from "lucide-react";

export default function SidebarDemo() {
  return (
    <div className="flex h-72 w-full overflow-hidden rounded-md border border-border bg-background">
      <Sidebar>
        <SidebarHeader className="justify-between">
          <span className="truncate text-sm font-semibold">Horon</span>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenuItem>
              <SidebarMenuButton active>
                <HomeIcon />
                <span>개요</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <UsersIcon />
                <span>멤버</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <BellIcon />
                <span>알림</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton>
            <SettingsIcon />
            <span>워크스페이스</span>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-1 p-5">
          <span className="text-sm font-medium">개요</span>
          <span className="text-[13px] text-muted-foreground">헤더의 버튼으로 사이드바를 접습니다.</span>
        </div>
      </SidebarInset>
    </div>
  );
}
