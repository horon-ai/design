import { useState } from "@lynx-js/react";

import { Banner } from "../../src/components/banner";
import { Backdrop } from "./backdrop";

/** A dismissible info strip plus a static danger strip, sharing the surface. */
function Examples({ surface }: { surface: "solid" | "glass" }) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <view className="flex w-full flex-col items-center gap-3">
      {dismissed ? (
        <view
          className="rounded-sm px-2 py-1"
          bindtap={() => setDismissed(false)}
          accessibility-element
          accessibility-traits="button"
          accessibility-label="Show the banner again"
        >
          <text className="text-label-sm text-text-secondary">show again</text>
        </view>
      ) : (
        <Banner
          surface={surface}
          className="w-full max-w-[640px]"
          action={
            <view
              bindtap={() => setDismissed(true)}
              accessibility-element
              accessibility-traits="button"
              accessibility-label="Dismiss"
            >
              <text className="text-label-lg text-text-primary underline">Dismiss</text>
            </view>
          }
        >
          Inbox Manager needs your yes on 2 drafts.
        </Banner>
      )}
      <Banner surface={surface} className="w-full max-w-[640px]" tone="danger" action="Reconnect">
        Could not reach Gmail. Reconnect to keep Inbox Manager running.
      </Banner>
      <view className="flex w-full flex-col items-center gap-3">
        <Banner surface={surface} size="sm" className="w-full max-w-[384px]">
          Small banner, still readable.
        </Banner>
        <Banner surface={surface} size="md" className="w-full max-w-[384px]">
          Default banner at the Figma size.
        </Banner>
        <Banner surface={surface} size="lg" className="w-full max-w-[384px]">
          Large banner for a stronger notice.
        </Banner>
      </view>
    </view>
  );
}

/** Solid and glass banners in all three sizes, with the danger tone. */
export default function BannerDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex w-full flex-col gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <Examples surface="solid" />
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <Examples surface="glass" />
      </Backdrop>
    </view>
  );
}
