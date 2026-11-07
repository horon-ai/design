import { Card } from "../../src/components/card";
import { Backdrop } from "./backdrop";

/** Two cards per surface: a plain one and an interactive selected one. */
function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex flex-row flex-wrap items-start justify-center gap-4">
      <Card
        surface={surface}
        className="w-full max-w-[320px]"
        title="Inbox Manager"
        description="6 emails need you. Drafts are ready for review."
      />
      <Card
        surface={surface}
        className="w-full max-w-[320px]"
        interactive
        selected
        onTap={() => undefined}
        title="Chief of staff"
        description="Morning brief is ready."
      />
    </view>
  );
}

/**
 * Solid and glass surfaces side by side; the selected card is the tappable one,
 * mirroring the site demo.
 */
export default function CardDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-4">
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
