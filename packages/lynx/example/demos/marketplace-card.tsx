import { useState, type ReactNode } from "@lynx-js/react";

import { Icon } from "../../src/icons";
import { MarketplaceCard } from "../../src/components/marketplace-card";
import { Backdrop } from "./backdrop";

/** One card that reports its own install state, so the Install button changes label. */
function DemoCard({
  surface,
  initials,
  name,
  author,
  description,
  chips,
  score,
  installs,
}: {
  surface: "solid" | "glass";
  initials: string;
  name: string;
  author: string;
  description: string;
  chips: { id: string; label: string; icon: ReactNode }[];
  score: string;
  installs: string;
}) {
  const [installed, setInstalled] = useState(false);
  return (
    <MarketplaceCard
      className="w-full max-w-[380px]"
      surface={surface}
      initials={initials}
      name={name}
      author={author}
      description={description}
      chips={chips}
      score={score}
      installs={installs}
      installLabel={installed ? "Installed" : "Install"}
      onInstall={() => setInstalled(true)}
    />
  );
}

const analyticsChips = [
  { id: "charts", label: "Charts", icon: <Icon name="ChartBar" weight="fill" /> },
  { id: "web", label: "Web", icon: <Icon name="Globe" weight="fill" /> },
];

const codeChips = [{ id: "code", label: "Code", icon: <Icon name="Code" weight="fill" /> }];

/** Solid and glass columns side by side, mirroring the site demo. */
export default function MarketplaceCardDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex w-full flex-row flex-wrap items-stretch justify-center gap-4">
          <DemoCard
            surface="solid"
            initials="AR"
            name="Analytics reports"
            author="by Horon"
            description="Turns raw exports into weekly summaries with charts and short written takeaways."
            chips={analyticsChips}
            score="4.8"
            installs="12K installs"
          />
          <DemoCard
            surface="solid"
            initials="CR"
            name="Code review"
            author="by Community"
            description="Reads a diff and leaves comments on risky changes."
            chips={codeChips}
            score="4.6"
            installs="3.1K installs"
          />
        </view>
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop className="items-stretch">
          <DemoCard
            surface="glass"
            initials="AR"
            name="Analytics reports"
            author="by Horon"
            description="Turns raw exports into weekly summaries with charts and short written takeaways."
            chips={analyticsChips}
            score="4.8"
            installs="12K installs"
          />
          <DemoCard
            surface="glass"
            initials="CR"
            name="Code review"
            author="by Community"
            description="Reads a diff and leaves comments on risky changes."
            chips={codeChips}
            score="4.6"
            installs="3.1K installs"
          />
        </Backdrop>
      </view>
    </view>
  );
}
