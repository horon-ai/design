import { Tabs, TabsList, TabsPanel, TabsTab } from "@horon-ai/react";
import { useState } from "react";

const copy: Record<string, string> = {
  activity: "Fourteen runs finished since Monday; two are waiting for a review.",
  routines: "The Friday investor update runs at 09:00 every Friday.",
  tools: "Linear, Stripe and Gmail are connected.",
};

export default function TabsPanels() {
  const [value, setValue] = useState("activity");
  return (
    <div className="flex w-full max-w-126.5 flex-col gap-3">
      <Tabs value={value} onValueChange={setValue}>
        <TabsList>
          <TabsTab value="activity">Activity</TabsTab>
          <TabsTab value="routines">Routines</TabsTab>
          <TabsTab value="tools">Tools</TabsTab>
        </TabsList>
        {Object.entries(copy).map(([tab, text]) => (
          <TabsPanel key={tab} value={tab} className="text-body-md text-text-primary">
            {text}
          </TabsPanel>
        ))}
      </Tabs>
      <p className="text-caption text-text-secondary">Selected: {value}</p>
    </div>
  );
}
