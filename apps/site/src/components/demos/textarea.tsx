import { Textarea } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

function Fields({ surface }: { surface: "solid" | "glass" }) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-center gap-3">
        <Textarea className="w-52" surface={surface} size="sm" placeholder="Small" />
        <Textarea className="w-52" surface={surface} placeholder="Medium" />
        <Textarea className="w-52" surface={surface} size="lg" placeholder="Large" />
      </div>
      <Textarea className="w-80" surface={surface} placeholder="Give the bot a task" />
    </>
  );
}

export default function TextareaDemo() {
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
