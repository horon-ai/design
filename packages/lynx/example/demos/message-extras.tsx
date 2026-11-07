import { useState } from "@lynx-js/react";

import { Attachment, CodeBlock, DateSeparator, MessageActions } from "../../src/components/message-extras";
import { Icon, type IconName } from "../../src/icons";
import { Backdrop } from "./backdrop";

const actions: { label: string; icon: IconName }[] = [
  { label: "Copy", icon: "Copy" },
  { label: "Regenerate", icon: "ArrowClockwise" },
  { label: "Good response", icon: "ThumbsUp" },
  { label: "Bad response", icon: "ThumbsDown" },
  { label: "More", icon: "DotsThree" },
];

function Extras({ surface }: { surface: "solid" | "glass" }) {
  const [picked, setPicked] = useState("none");
  const [removed, setRemoved] = useState(false);
  const items = actions.slice(0, surface === "glass" ? 3 : 5).map((action) => ({
    label: action.label,
    icon: <Icon name={action.icon} />,
    onClick: () => setPicked(action.label),
  }));
  return (
    <view className="flex w-full max-w-[360px] flex-col gap-6">
      <view className="flex flex-row flex-wrap items-center gap-3">
        <MessageActions actions={items} surface={surface} />
      </view>
      <DateSeparator>Today</DateSeparator>
      {removed ? null : (
        <Attachment
          name="Q3 board deck v5.pdf"
          detail="PDF · 2.4 MB"
          onRemove={() => setRemoved(true)}
        />
      )}
      <CodeBlock language="bash" code={"horon routine run weekly-report \\\n  --to alpoxdev@gmail.com"} />
      <text className="text-caption text-text-secondary">{`picked: ${picked}`}</text>
    </view>
  );
}

/** The message extras at both surfaces, with a live action pill and a removable attachment. */
export default function MessageExtrasDemo() {
  return (
    <view className="flex w-full flex-col gap-6">
      <view className="flex w-full flex-col items-center gap-3">
        <view className="w-full max-w-[360px]">
          <text className="text-caption text-text-secondary">Solid</text>
        </view>
        <Extras surface="solid" />
      </view>
      <view className="flex w-full flex-col items-center gap-3">
        <view className="w-full max-w-[360px]">
          <text className="text-caption text-text-secondary">Glass</text>
        </view>
        <Backdrop>
          <Extras surface="glass" />
        </Backdrop>
      </view>
    </view>
  );
}
