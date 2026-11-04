import { MarketplaceCard } from "@horon-ai/react";
import { ChartBar, Code, Globe } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function MarketplaceCardDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Backdrop className="items-stretch">
        <MarketplaceCard
          className="w-full max-w-95"
          surface="glass"
          initials="AR"
          name="Analytics reports"
          author="by Horon"
          description="Turns raw exports into weekly summaries with charts and short written takeaways."
          chips={[
            { id: "charts", label: "Charts", icon: <ChartBar aria-hidden /> },
            { id: "web", label: "Web", icon: <Globe aria-hidden /> },
          ]}
          score="4.8"
          installs="12K installs"
        />
        <MarketplaceCard
          className="w-full max-w-95"
          surface="glass"
          initials="CR"
          name="Code review"
          author="by Community"
          description="Reads a diff and leaves comments on risky changes."
          chips={[{ id: "code", label: "Code", icon: <Code aria-hidden /> }]}
          score="4.6"
          installs="3.1K installs"
        />
      </Backdrop>
      <div className="flex w-full items-stretch justify-center gap-4 rounded-2xl bg-bg-default p-4">
        <MarketplaceCard
          className="w-full max-w-95"
          initials="AR"
          name="Analytics reports"
          author="by Horon"
          description="Turns raw exports into weekly summaries with charts and short written takeaways."
          chips={[
            { id: "charts", label: "Charts", icon: <ChartBar aria-hidden /> },
            { id: "web", label: "Web", icon: <Globe aria-hidden /> },
          ]}
          score="4.8"
          installs="12K installs"
        />
      </div>
    </div>
  );
}
