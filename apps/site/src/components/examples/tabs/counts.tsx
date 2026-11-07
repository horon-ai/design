import { Tabs, TabsList, TabsTab } from "@horon-ai/react";
import { Pulse, Repeat, Wrench } from "@phosphor-icons/react";

export default function TabsCounts() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Tabs defaultValue="mcp">
        <TabsList>
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

      <Tabs defaultValue="routines">
        <TabsList>
          <TabsTab value="activity" icon={<Pulse />}>
            Activity
          </TabsTab>
          <TabsTab value="routines" icon={<Repeat />} count={2}>
            Routines
          </TabsTab>
          <TabsTab value="tools" icon={<Wrench />}>
            Tools
          </TabsTab>
        </TabsList>
      </Tabs>
    </div>
  );
}
