import { useState } from "@lynx-js/react";

import { FileDrop, type FileDropFile, type FileDropSurface } from "../../src/components/file-drop";

import { Backdrop } from "./backdrop";

/** The host owns the files: this demo reports a descriptor as if its own picker had returned one. */
const REPORT: FileDropFile[] = [{ name: "report.pdf", size: 248_320, type: "application/pdf", path: "/tmp/report.pdf" }];

function Examples({ surface }: { surface: FileDropSurface }) {
  const [files, setFiles] = useState<FileDropFile[]>([]);
  return (
    <view className="flex w-full max-w-[550px] flex-col gap-4">
      <FileDrop
        surface={surface}
        files={files}
        label={files.length > 0 ? files.map((file) => file.name).join(", ") : "Drop contracts here or tap to upload"}
        onPick={() => setFiles(REPORT)}
      />
      <FileDrop surface={surface} uploading label="Uploading report.pdf" />
      <FileDrop surface={surface} rejected label="That file type isn't supported" />
      <FileDrop surface={surface} disabled label="Uploads are off for this workspace" />
    </view>
  );
}

/** Solid and glass: idle, uploading, rejected and disabled. */
export default function FileDropDemo() {
  return (
    <view className="flex w-full flex-col gap-6">
      <view className="flex flex-col gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex justify-center">
          <Examples surface="solid" />
        </view>
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <Examples surface="glass" />
      </Backdrop>
    </view>
  );
}
