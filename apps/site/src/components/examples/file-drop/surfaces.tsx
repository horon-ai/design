import { FileDrop } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function FileDropSurfaces() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <FileDrop surface="solid" />
      <Backdrop className="flex-col">
        <FileDrop surface="glass" />
      </Backdrop>
    </div>
  );
}
