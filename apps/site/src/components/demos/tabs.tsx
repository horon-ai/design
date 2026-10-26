import { Tabs, TabsList, TabsPanel, TabsTab } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function TabsDemo() {
  return (
    <Backdrop>
      <Tabs defaultValue="activity">
        <TabsList>
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
    </Backdrop>
  );
}
