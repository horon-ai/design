import { Banner } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function BannerDemo() {
  return (
    <Backdrop className="flex-col">
      <Banner surface="glass" className="w-full max-w-160" action={<button type="button">Review</button>}>
        Inbox Manager needs your yes on 2 drafts.
      </Banner>
      <Banner
        surface="glass"
        className="w-full max-w-160"
        tone="danger"
        action={<button type="button">Reconnect</button>}
      >
        Couldn&apos;t reach Gmail. Reconnect to keep Inbox Manager running.
      </Banner>
      <div className="flex w-full flex-wrap items-start justify-center gap-3">
        <Banner surface="glass" size="sm" className="w-full max-w-96">
          Small banner, still readable.
        </Banner>
        <Banner surface="glass" size="md" className="w-full max-w-96">
          Default banner at the Figma size.
        </Banner>
        <Banner surface="glass" size="lg" className="w-full max-w-96">
          Large banner for a stronger notice.
        </Banner>
      </div>
      <Banner className="w-full max-w-160" action={<button type="button">Review</button>}>
        Solid banner on the page.
      </Banner>
    </Backdrop>
  );
}
