import { TextareaField } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function TextareaFieldGlass() {
  return (
    <Backdrop className="flex-col">
      <TextareaField
        className="w-full max-w-72"
        surface="glass"
        label="Instructions"
        hint="Optional"
        placeholder="Tell the bot how you like your inbox handled"
        description="Read before every task."
        maxLength={200}
      />
    </Backdrop>
  );
}
