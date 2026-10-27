import { TextareaField } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function TextareaFieldDemo() {
  return (
    <Backdrop className="flex-col">
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
        label="Instructions"
        defaultValue="Skip newsletters."
        error="Add at least 40 characters."
        maxLength={240}
      />
    </Backdrop>
  );
}
