import { useState } from "@lynx-js/react";

import { Button } from "../../src/components/button";
import { Icon } from "../../src/icons";
import { Backdrop } from "./backdrop";

/** The four opaque variants in every size, plus the size-independent link. */
function SolidExamples({ onApprove }: { onApprove: () => void }) {
  return (
    <view className="flex w-full flex-row flex-wrap items-center justify-center gap-4">
      <Button variant="solid" onClick={onApprove}>
        Cancel
      </Button>
      <Button variant="solid" icon={<Icon name="Plus" />} onClick={onApprove}>
        New bot
      </Button>
      <Button variant="solid" size="sm" onClick={onApprove}>
        Small
      </Button>
      <Button variant="solid" size="lg" onClick={onApprove}>
        Large
      </Button>
      <Button variant="solid" disabled>
        Disabled
      </Button>
      <Button onClick={onApprove}>Approve</Button>
      <Button variant="danger" onClick={onApprove}>
        Delete bot
      </Button>
      <Button variant="link" onClick={onApprove}>
        Show all
      </Button>
    </view>
  );
}

/** Glass only shows its material over imagery, so the glass row sits on the sky backdrop. */
function GlassExamples() {
  return (
    <Backdrop>
      <Button variant="glass">Cancel</Button>
      <Button variant="glass" icon={<Icon name="ArrowRight" />}>
        Continue
      </Button>
      <Button variant="glass" size="sm">
        Small
      </Button>
      <Button variant="glass" size="lg">
        Large
      </Button>
      <Button variant="glass" disabled>
        Disabled
      </Button>
    </Backdrop>
  );
}

/**
 * The Button gallery: every treatment, the three sizes, a leading icon and the
 * disabled state. The opaque row counts its taps so the press feedback and the
 * handler wiring are both visible on a touch screen, where there is no hover.
 */
export default function ButtonDemo() {
  const [taps, setTaps] = useState(0);

  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <SolidExamples onApprove={() => setTaps(taps + 1)} />
        <text className="text-caption text-text-secondary">taps: {taps}</text>
      </view>
      <view className="flex flex-col gap-4">
        <text className="text-caption text-text-secondary">Glass</text>
        <GlassExamples />
      </view>
    </view>
  );
}
