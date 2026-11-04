import { TextareaField } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

function Fields({ surface }: { surface: "solid" | "glass" }) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-center gap-3">
        <TextareaField className="w-full max-w-52" surface={surface} size="sm" label="Small" maxLength={240} />
        <TextareaField className="w-full max-w-52" surface={surface} label="Medium" maxLength={240} />
        <TextareaField className="w-full max-w-52" surface={surface} size="lg" label="Large" maxLength={240} />
      </div>
      <TextareaField
        className="w-full max-w-96"
        surface={surface}
        label="Instructions"
        hint="Optional"
        placeholder="Tell the bot how you like your inbox handled"
        description="The bot reads this before every task."
        maxLength={240}
      />
      <TextareaField
        className="w-full max-w-96"
        surface={surface}
        label="Instructions"
        defaultValue="Skip newsletters."
        maxLength={240}
      />
      <TextareaField
        className="w-full max-w-96"
        surface={surface}
        label="Instructions"
        defaultValue="Skip newsletters."
        error="Add at least 40 characters."
        maxLength={240}
      />
    </>
  );
}

export default function TextareaFieldDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full flex-col items-center gap-4">
          <Fields surface="solid" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop className="flex-col">
          <Fields surface="glass" />
        </Backdrop>
      </div>
    </div>
  );
}
