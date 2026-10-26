import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/Tabs",
  component: Tabs,
  decorators: [onBackdrop],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="activity">
      <TabsList>
        <TabsTab value="activity">Activity</TabsTab>
        <TabsTab value="routines">Routines</TabsTab>
        <TabsTab value="tools">Tools</TabsTab>
        <TabsTab value="settings">Settings</TabsTab>
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
      <TabsPanel value="settings" className="text-body-md text-text-primary">
        Workspace settings.
      </TabsPanel>
    </Tabs>
  ),
};
