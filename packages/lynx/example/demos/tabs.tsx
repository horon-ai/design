import { Tabs, TabsList, TabsPanel, TabsTab } from "../../src/components/tabs";

import { Backdrop } from "./backdrop";

/**
 * The three rungs, the count pills and both list variants on each surface. A
 * `Tabs` without panels is a bare list, exactly as in the site demo.
 */
function Lists({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex w-full flex-col gap-4">
      <Tabs defaultValue="activity" size="sm">
        <TabsList surface={surface}>
          <TabsTab value="activity">Small</TabsTab>
          <TabsTab value="routines">Routines</TabsTab>
          <TabsTab value="tools">Tools</TabsTab>
        </TabsList>
      </Tabs>
      <Tabs defaultValue="activity">
        <TabsList surface={surface}>
          <TabsTab value="activity">Activity</TabsTab>
          <TabsTab value="routines">Routines</TabsTab>
          <TabsTab value="tools">Tools</TabsTab>
        </TabsList>
        <TabsPanel value="activity">
          <text className="text-body-md text-text-primary">Recent runs show up here.</text>
        </TabsPanel>
        <TabsPanel value="routines">
          <text className="text-body-md text-text-primary">Routines run on a schedule.</text>
        </TabsPanel>
        <TabsPanel value="tools">
          <text className="text-body-md text-text-primary">Connected tools.</text>
        </TabsPanel>
      </Tabs>
      <Tabs defaultValue="activity" size="lg">
        <TabsList surface={surface}>
          <TabsTab value="activity">Large</TabsTab>
          <TabsTab value="routines">Routines</TabsTab>
          <TabsTab value="tools">Tools</TabsTab>
        </TabsList>
      </Tabs>
      <Tabs defaultValue="mcp">
        <TabsList surface={surface}>
          <TabsTab value="skills" count={6}>
            Skills
          </TabsTab>
          <TabsTab value="mcp" count={4}>
            MCP
          </TabsTab>
          <TabsTab value="plugins" count={3}>
            Plugins
          </TabsTab>
        </TabsList>
      </Tabs>
    </view>
  );
}

export default function TabsDemo() {
  return (
    <view className="flex w-full flex-col gap-6">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex w-full flex-col items-center gap-4">
          <Lists surface="solid" />
        </view>
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop className="flex-col">
          <Lists surface="glass" />
        </Backdrop>
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Underline</text>
        <Tabs defaultValue="command" size="lg">
          <TabsList variant="underline">
            <TabsTab value="command">Command</TabsTab>
            <TabsTab value="manual">Manual</TabsTab>
            <TabsTab value="plugins" disabled>
              Plugins
            </TabsTab>
          </TabsList>
          <TabsPanel value="command">
            <text className="text-body-md text-text-primary">bun add @horon-ai/lynx</text>
          </TabsPanel>
          <TabsPanel value="manual">
            <text className="text-body-md text-text-primary">Copy the component source into your project.</text>
          </TabsPanel>
        </Tabs>
      </view>
    </view>
  );
}
