import { MarketplaceCard } from "@horon-ai/react";

export default function MarketplaceCardRating() {
  return (
    <div className="flex w-full flex-wrap items-stretch justify-center gap-4">
      <MarketplaceCard
        className="w-full max-w-80"
        initials="SC"
        name="Score only"
        author="by Horon"
        description="A card with a rating and no install count."
        score="4.9"
      />
      <MarketplaceCard
        className="w-full max-w-80"
        initials="IN"
        name="Installs only"
        author="by Community"
        description="A card with an install count and no rating."
        installs="840 installs"
      />
      <MarketplaceCard
        className="w-full max-w-80"
        initials="BO"
        name="Both"
        author="by Horon"
        description="A card with both values, separated by a middle dot."
        score="4.7"
        installs="6.2K installs"
        onInstall={() => undefined}
      />
    </div>
  );
}
