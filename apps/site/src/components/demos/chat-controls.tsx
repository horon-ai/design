import { JumpToLatest, NewMessagesPill, VoiceInput } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <JumpToLatest surface={surface} />
      <NewMessagesPill surface={surface}>3 new messages</NewMessagesPill>
      <VoiceInput surface={surface} elapsed="0:07" />
    </div>
  );
}

export default function ChatControlsDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
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
