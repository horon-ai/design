import { Textarea } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function TextareaDemo() {
  return (
    <Backdrop>
      <div className="flex flex-wrap items-end justify-center gap-3">
        <Textarea className="w-52" size="sm" placeholder="Small" />
        <Textarea className="w-52" placeholder="Medium" />
        <Textarea className="w-52" size="lg" placeholder="Large" />
      </div>
      <Textarea className="w-80" placeholder="Give the bot a task" />
      <Textarea className="w-80" surface="glass" placeholder="Give the bot a task" />
    </Backdrop>
  );
}
