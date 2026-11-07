import { Textarea } from "../../src/components/textarea";

import { Backdrop } from "./backdrop";

function Fields({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex flex-col items-center gap-4">
      <view className="flex flex-row flex-wrap items-end justify-center gap-3">
        <Textarea className="w-52" surface={surface} size="sm" placeholder="Small" />
        <Textarea className="w-52" surface={surface} placeholder="Medium" />
        <Textarea className="w-52" surface={surface} size="lg" placeholder="Large" />
      </view>
      <Textarea className="w-full max-w-80" surface={surface} placeholder="Give the bot a task" />
    </view>
  );
}

export default function TextareaDemo() {
  return (
    <view className="flex w-full flex-col gap-6">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <Fields surface="solid" />
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop className="flex-col">
          <Fields surface="glass" />
        </Backdrop>
      </view>
    </view>
  );
}
