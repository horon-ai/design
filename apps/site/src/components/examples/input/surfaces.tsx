import { Input } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function InputSurfaces() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full max-w-72 rounded-lg bg-bg-surface p-4">
        <Input surface="solid" placeholder="Solid on a raised surface" aria-label="Solid input" />
      </div>
      <div className="w-full max-w-72 rounded-lg bg-bg-default p-4">
        <Input surface="solid-on-page" placeholder="Solid on the page" aria-label="Solid on page input" />
      </div>
      <Backdrop>
        <Input className="w-full max-w-64" surface="glass" placeholder="Glass over imagery" aria-label="Glass input" />
      </Backdrop>
    </div>
  );
}
