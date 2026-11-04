import { FileDrop, type FileDropSurface } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

function Examples({ surface }: { surface: FileDropSurface }) {
  return (
    <div className="flex w-full max-w-[550px] flex-col gap-4">
      <FileDrop surface={surface} />
      <FileDrop surface={surface} uploading label="Uploading report.pdf" />
      <FileDrop surface={surface} rejected label="That file type isn't supported" />
      <FileDrop surface={surface} disabled label="Uploads are off for this workspace" />
    </div>
  );
}

export default function FileDropDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex justify-center">
          <Examples surface="solid" />
        </div>
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <Examples surface="glass" />
      </Backdrop>
    </div>
  );
}
