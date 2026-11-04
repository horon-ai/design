import { MarketplaceCard } from "@horon-ai/react";
import { ChartBar, Code, Globe } from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";

import { Backdrop } from "../demo-backdrop";

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
      className="w-full max-w-95"
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
  { id: "charts", label: "Charts", icon: <ChartBar aria-hidden weight="fill" /> },
  { id: "web", label: "Web", icon: <Globe aria-hidden weight="fill" /> },
];

const codeChips = [{ id: "code", label: "Code", icon: <Code aria-hidden weight="fill" /> }];

export default function MarketplaceCardDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full flex-wrap items-stretch justify-center gap-4">
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
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
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
      </div>
    </div>
  );
}
