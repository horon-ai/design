import { Banner } from "@horon-ai/react";

export default function BannerTones() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Banner className="w-full max-w-160">Inbox Manager needs your yes on 2 drafts.</Banner>
      <Banner className="w-full max-w-160" tone="danger">
        Couldn&apos;t reach Gmail. Reconnect to keep Inbox Manager running.
      </Banner>
    </div>
  );
}
