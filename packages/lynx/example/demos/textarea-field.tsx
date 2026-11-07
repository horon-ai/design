import { TextareaField } from "../../src/components/textarea-field";

import { Backdrop } from "./backdrop";

function Fields({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex w-full max-w-96 flex-col gap-4">
      <TextareaField className="w-full" surface={surface} size="sm" label="Small" maxLength={240} />
      <TextareaField className="w-full" surface={surface} label="Medium" maxLength={240} />
      <TextareaField className="w-full" surface={surface} size="lg" label="Large" maxLength={240} />
      <TextareaField
        className="w-full"
        surface={surface}
        label="Instructions"
        hint="Optional"
        placeholder="Tell the bot how you like your inbox handled"
        description="The bot reads this before every task."
        maxLength={240}
      />
      <TextareaField className="w-full" surface={surface} label="Instructions" defaultValue="Skip newsletters." maxLength={240} />
      <TextareaField
        className="w-full"
        surface={surface}
        label="Instructions"
        defaultValue="Skip newsletters."
        error="Add at least 40 characters."
        maxLength={240}
      />
    </view>
  );
}

export default function TextareaFieldDemo() {
  return (
    <view className="flex w-full flex-col gap-6">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex w-full flex-col items-center gap-4">
          <Fields surface="solid" />
        </view>
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
