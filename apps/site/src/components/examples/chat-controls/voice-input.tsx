import { VoiceInput } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

const levels = [0.2, 0.5, 0.9, 0.4, 1, 0.7, 0.3, 0.8, 1, 0.5, 0.2, 0.6];

export default function ChatControlsVoice() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <VoiceInput elapsed="0:07" onStop={() => undefined} />
      <VoiceInput elapsed="0:12" recording={false} onStop={() => undefined} />
      <Backdrop>
        <VoiceInput surface="glass" elapsed="0:03" levels={levels} onStop={() => undefined} />
      </Backdrop>
    </div>
  );
}
