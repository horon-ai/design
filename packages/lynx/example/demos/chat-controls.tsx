import { useState } from "@lynx-js/react";

import { JumpToLatest, NewMessagesPill, VoiceInput } from "../../src/components/chat-controls";
import { Backdrop } from "./backdrop";

/** The three controls at one surface, exactly as the site demo lays them out. */
function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex w-full min-w-0 flex-row flex-wrap items-center justify-center gap-4">
      <JumpToLatest surface={surface} />
      <NewMessagesPill surface={surface}>3 new messages</NewMessagesPill>
      <VoiceInput surface={surface} elapsed="0:07" />
    </view>
  );
}

/** The chat controls, with the stop button and the jump button reporting their taps. */
export default function ChatControlsDemo() {
  const [last, setLast] = useState("none");
  return (
    <view className="flex w-full flex-col gap-6">
      <view className="flex flex-col gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex w-full min-w-0 flex-row flex-wrap items-center justify-center gap-4">
          <JumpToLatest onClick={() => setLast("jumped to latest")} />
          <NewMessagesPill>3 new messages</NewMessagesPill>
          <VoiceInput elapsed="0:07" onStop={() => setLast("recording stopped")} />
        </view>
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <Examples surface="glass" />
      </Backdrop>
      <text className="text-caption text-text-secondary">{`last: ${last}`}</text>
    </view>
  );
}
