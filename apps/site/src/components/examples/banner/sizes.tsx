import { Banner } from "@horon-ai/react";

export default function BannerSizes() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Banner size="sm" className="w-full max-w-120">
        Your digest is scheduled for Monday.
      </Banner>
      <Banner size="md" className="w-full max-w-120">
        Your digest is scheduled for Monday.
      </Banner>
      <Banner size="lg" className="w-full max-w-120">
        Your digest is scheduled for Monday.
      </Banner>
    </div>
  );
}
