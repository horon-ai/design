import { Tabs, TabsList, TabsPanel, TabsTab } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function TabsDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Backdrop className="flex-col">
        <Tabs defaultValue="activity" size="sm">
          <TabsList surface="glass">
            <TabsTab value="activity">Small</TabsTab>
            <TabsTab value="routines">Routines</TabsTab>
            <TabsTab value="tools">Tools</TabsTab>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="activity">
          <TabsList surface="glass">
            <TabsTab value="activity">Activity</TabsTab>
            <TabsTab value="routines">Routines</TabsTab>
            <TabsTab value="tools">Tools</TabsTab>
          </TabsList>
          <TabsPanel value="activity" className="text-body-md text-text-primary">
            Recent runs show up here.
          </TabsPanel>
          <TabsPanel value="routines" className="text-body-md text-text-primary">
            Routines run on a schedule.
          </TabsPanel>
          <TabsPanel value="tools" className="text-body-md text-text-primary">
            Connected tools.
          </TabsPanel>
        </Tabs>
        <Tabs defaultValue="activity" size="lg">
          <TabsList surface="glass">
            <TabsTab value="activity">Large</TabsTab>
            <TabsTab value="routines">Routines</TabsTab>
            <TabsTab value="tools">Tools</TabsTab>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="mcp">
          <TabsList className="gap-1" surface="glass">
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
      </Backdrop>
      <div className="flex w-full flex-col items-center gap-4 rounded-2xl bg-bg-default p-4">
        <Tabs defaultValue="activity">
          <TabsList>
            <TabsTab value="activity">Activity</TabsTab>
            <TabsTab value="routines">Routines</TabsTab>
            <TabsTab value="tools">Tools</TabsTab>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="mcp">
          <TabsList className="gap-1">
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
      </div>
    </div>
  );
}
