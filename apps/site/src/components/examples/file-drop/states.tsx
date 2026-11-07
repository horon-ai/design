import { FileDrop } from "@horon-ai/react";

export default function FileDropStates() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <FileDrop />
      <FileDrop uploading label="Uploading report.pdf" />
      <FileDrop rejected label="That file type isn't supported" />
      <FileDrop disabled label="Uploads are off for this workspace" />
    </div>
  );
}
