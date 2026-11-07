import { MarketplaceCard } from "@horon-ai/react";
import { ChartBar, Globe } from "@phosphor-icons/react";

import { Backdrop } from "../../demo-backdrop";

const chips = [
  { id: "charts", label: "Charts", icon: <ChartBar aria-hidden weight="fill" /> },
  { id: "web", label: "Web", icon: <Globe aria-hidden weight="fill" /> },
];

export default function MarketplaceCardGlass() {
  return (
    <Backdrop className="items-stretch">
      <MarketplaceCard
        className="w-full max-w-95"
        surface="glass"
        initials="AR"
        name="Analytics reports"
        author="by Horon"
        description="Turns raw exports into weekly summaries with charts and short written takeaways."
        chips={chips}
        score="4.8"
        installs="12K installs"
        onInstall={() => undefined}
      />
      <MarketplaceCard
        className="w-full max-w-95"
        surface="glass"
        initials="CR"
        name="Code review"
        author="by Community"
        description="Reads a diff and leaves comments on risky changes."
        score="4.6"
        installs="3.1K installs"
        onInstall={() => undefined}
      />
    </Backdrop>
  );
}
