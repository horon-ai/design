import { Banner } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Banner surface={surface} className="w-full max-w-160" action={<button type="button">Review</button>}>
        Inbox Manager needs your yes on 2 drafts.
      </Banner>
      <Banner
        surface={surface}
        className="w-full max-w-160"
        tone="danger"
        action={<button type="button">Reconnect</button>}
      >
        Couldn&apos;t reach Gmail. Reconnect to keep Inbox Manager running.
      </Banner>
      <div className="flex w-full flex-col items-center gap-3">
        <Banner surface={surface} size="sm" className="w-full max-w-96">
          Small banner, still readable.
        </Banner>
        <Banner surface={surface} size="md" className="w-full max-w-96">
          Default banner at the Figma size.
        </Banner>
        <Banner surface={surface} size="lg" className="w-full max-w-96">
          Large banner for a stronger notice.
        </Banner>
      </div>
    </div>
  );
}

export default function BannerDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <Examples surface="solid" />
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <Examples surface="glass" />
      </Backdrop>
    </div>
  );
}
