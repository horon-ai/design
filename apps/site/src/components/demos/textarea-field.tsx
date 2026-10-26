import { TextareaField } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function TextareaFieldDemo() {
  return (
    <Backdrop>
      <TextareaField
        className="w-96"
        label="Instructions"
        hint="Optional"
        placeholder="Tell the bot how you like your inbox handled"
        description="The bot reads this before every task."
        maxLength={280}
      />
    </Backdrop>
  );
}
