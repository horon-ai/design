import { Tabs, TabsList, TabsTab } from "@horon-ai/react";

export default function TabsSizes() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Tabs key={size} defaultValue="activity" size={size}>
          <TabsList>
            <TabsTab value="activity">Activity</TabsTab>
            <TabsTab value="routines">Routines</TabsTab>
            <TabsTab value="tools">Tools</TabsTab>
          </TabsList>
        </Tabs>
      ))}
    </div>
  );
}
