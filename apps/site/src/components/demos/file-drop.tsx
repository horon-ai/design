import { FileDrop } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function FileDropDemo() {
  return (
    <Backdrop>
      <div className="flex w-full max-w-[550px] flex-col gap-4">
        <FileDrop />
        <FileDrop uploading label="Uploading report.pdf" />
        <FileDrop rejected label="That file type isn't supported" />
      </div>
    </Backdrop>
  );
}
