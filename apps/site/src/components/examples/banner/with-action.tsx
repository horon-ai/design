import { Banner } from "@horon-ai/react";

export default function BannerWithAction() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Banner className="w-full max-w-160" action={<button type="button">Review</button>}>
        Inbox Manager needs your yes on 2 drafts.
      </Banner>
      <Banner
        className="w-full max-w-160"
        tone="danger"
        action={<button type="button">Reconnect</button>}
      >
        Couldn&apos;t reach Gmail.
      </Banner>
    </div>
  );
}
