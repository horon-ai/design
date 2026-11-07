import { Banner } from "@horon-ai/react";

export default function BannerThumbnail() {
  return (
    <div className="flex w-80 flex-col gap-3">
      <Banner action={<button type="button">Review</button>}>2 drafts need your yes.</Banner>
      <Banner tone="danger" action={<button type="button">Reconnect</button>}>
        Could not reach Gmail.
      </Banner>
    </div>
  );
}
