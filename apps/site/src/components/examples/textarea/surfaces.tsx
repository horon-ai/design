import { Textarea } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function TextareaSurfaces() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full max-w-80 rounded-lg bg-bg-surface p-4">
        <Textarea surface="solid" placeholder="Solid on a raised surface" aria-label="Solid textarea" />
      </div>
      <div className="w-full max-w-80 rounded-lg bg-bg-default p-4">
        <Textarea surface="solid-on-page" placeholder="Solid on the page" aria-label="On-page textarea" />
      </div>
      <Backdrop>
        <Textarea className="w-full max-w-72" surface="glass" placeholder="Glass over imagery" aria-label="Glass textarea" />
      </Backdrop>
    </div>
  );
}
