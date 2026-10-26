import { Textarea } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function TextareaDemo() {
  return (
    <Backdrop>
      <Textarea className="w-80" placeholder="Give the bot a task" />
    </Backdrop>
  );
}
