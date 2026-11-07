import { MarketplaceCard } from "@horon-ai/react";

export default function MarketplaceCardThumbnail() {
  return (
    <MarketplaceCard
      className="w-[290px]"
      initials="AR"
      name="Analytics reports"
      author="by Horon"
      description="Weekly summaries with charts."
      score="4.8"
      installs="12K installs"
      onInstall={() => undefined}
    />
  );
}
