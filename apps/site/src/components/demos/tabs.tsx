import { Tabs, TabsList, TabsPanel, TabsTab } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

function Lists({ surface }: { surface: "solid" | "glass" }) {
  return (
    <>
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
    </>
  );
}

export default function TabsDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full flex-col items-center gap-4">
          <Lists surface="solid" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop className="flex-col">
          <Lists surface="glass" />
        </Backdrop>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Underline</p>
        <Tabs defaultValue="command" size="lg">
          <TabsList variant="underline">
            <TabsTab value="command">Command</TabsTab>
            <TabsTab value="manual">Manual</TabsTab>
          </TabsList>
          <TabsPanel value="command" className="text-body-md text-text-primary">
            bun add @horon-ai/react
          </TabsPanel>
          <TabsPanel value="manual" className="text-body-md text-text-primary">
            Copy the component source into your project.
          </TabsPanel>
        </Tabs>
      </div>
    </div>
  );
}
