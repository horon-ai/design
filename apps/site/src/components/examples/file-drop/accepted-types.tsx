import { FileDrop } from "@horon-ai/react";
import { useState } from "react";

export default function FileDropAcceptedTypes() {
  const [files, setFiles] = useState<string[]>([]);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <FileDrop
        accept=".pdf,.png,.jpg"
        multiple
        label="Drop contracts or images here, or click to upload"
        onFiles={(picked) => setFiles((current) => [...current, ...picked.map((file) => file.name)])}
      />
      <p className="text-caption text-text-secondary">
        {files.length === 0 ? "PDF, PNG and JPG only" : `${files.length} file(s): ${files.join(", ")}`}
      </p>
    </div>
  );
}
