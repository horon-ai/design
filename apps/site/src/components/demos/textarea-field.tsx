import { TextareaField } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function TextareaFieldDemo() {
  return (
    <Backdrop className="flex-col">
      <div className="flex flex-wrap items-start justify-center gap-3">
        <TextareaField className="w-full max-w-52" size="sm" label="Small" maxLength={240} />
        <TextareaField className="w-full max-w-52" label="Medium" maxLength={240} />
        <TextareaField className="w-full max-w-52" size="lg" label="Large" maxLength={240} />
      </div>
      <TextareaField
        className="w-full max-w-96"
        label="Instructions"
        hint="Optional"
        placeholder="Tell the bot how you like your inbox handled"
        description="The bot reads this before every task."
        maxLength={240}
      />
      <TextareaField
        className="w-full max-w-96"
        surface="glass"
        label="Instructions"
        hint="Optional"
        placeholder="Tell the bot how you like your inbox handled"
        maxLength={240}
      />
      <TextareaField
        className="w-full max-w-96"
        label="Instructions"
        defaultValue="Skip newsletters."
        error="Add at least 40 characters."
        maxLength={240}
      />
    </Backdrop>
  );
}
