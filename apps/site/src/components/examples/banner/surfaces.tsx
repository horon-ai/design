import { Banner } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function BannerSurfaces() {
  return (
    <Backdrop className="flex-col">
      <Banner surface="glass" className="w-full max-w-160" action={<button type="button">Review</button>}>
        Inbox Manager needs your yes on 2 drafts.
      </Banner>
      <Banner surface="glass" className="w-full max-w-160" tone="danger">
        Couldn&apos;t reach Gmail.
      </Banner>
    </Backdrop>
  );
}
