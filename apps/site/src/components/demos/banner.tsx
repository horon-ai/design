import { Banner } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function BannerDemo() {
  return (
    <Backdrop className="flex-col">
      <Banner className="w-full max-w-160" action={<button type="button">Review</button>}>
        Inbox Manager needs your yes on 2 drafts.
      </Banner>
      <Banner className="w-full max-w-160" tone="danger" action={<button type="button">Reconnect</button>}>
        Couldn&apos;t reach Gmail. Reconnect to keep Inbox Manager running.
      </Banner>
    </Backdrop>
  );
}
