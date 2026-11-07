import { Tabs, TabsList, TabsPanel, TabsTab } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function TabsVariants() {
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTab value="activity">Activity</TabsTab>
          <TabsTab value="routines">Routines</TabsTab>
          <TabsTab value="tools">Tools</TabsTab>
        </TabsList>
        <TabsPanel value="activity" className="text-body-md text-text-primary">
          Recent runs show up here.
        </TabsPanel>
      </Tabs>

      <Backdrop className="flex-col">
        <Tabs defaultValue="activity">
          <TabsList surface="glass">
            <TabsTab value="activity">Activity</TabsTab>
            <TabsTab value="routines">Routines</TabsTab>
            <TabsTab value="tools">Tools</TabsTab>
          </TabsList>
        </Tabs>
      </Backdrop>

      <Tabs defaultValue="command" className="w-full max-w-126.5">
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
  );
}
