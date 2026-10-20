import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadList,
  FileUploadTrigger,
} from "@horon-ai/react/components/file-upload";
import { UploadIcon } from "lucide-react";

const meta = {
  title: "Web/FileUpload",
  component: FileUpload,
  parameters: { layout: "centered" },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

type DemoFile = {
  name: string;
  size: number;
  status: "uploading" | "done" | "error";
};

const demoFiles: DemoFile[] = [
  { name: "brand-guidelines.pdf", size: 2_400_000, status: "done" },
  { name: "hero-render.png", size: 5_100_000, status: "uploading" },
  { name: "logo-source.svg", size: 512_000, status: "error" },
];

function DropzoneCopy() {
  return (
    <>
      <UploadIcon />
      <p className="text-sm text-foreground">
        <span className="font-medium">Drag and drop</span> files here
      </p>
      <p className="text-xs text-muted-foreground">PDF, PNG or SVG up to 10MB each</p>
    </>
  );
}

function FileList() {
  const [items, setItems] = React.useState(demoFiles);

  return (
    <FileUploadList>
      {items.map((file, index) => (
        <FileUploadItem
          key={file.name}
          name={file.name}
          size={file.size}
          status={file.status}
          onRemove={() => setItems((previous) => previous.filter((_, itemIndex) => itemIndex !== index))}
        />
      ))}
    </FileUploadList>
  );
}

export const Playground: Story = {
  render: () => (
    <FileUpload className="w-96" accept=".pdf,.png,.svg">
      <FileUploadDropzone>
        <DropzoneCopy />
      </FileUploadDropzone>
      <FileList />
    </FileUpload>
  ),
};

export const WithTrigger: Story = {
  render: () => (
    <FileUpload className="w-96" accept=".pdf,.png,.svg">
      <FileUploadDropzone className="py-10">
        <DropzoneCopy />
      </FileUploadDropzone>
      <FileUploadTrigger>Browse files</FileUploadTrigger>
      <FileList />
    </FileUpload>
  ),
};

export const Single: Story = {
  render: () => (
    <FileUpload className="w-96" multiple={false} accept="image/*">
      <FileUploadDropzone>
        <UploadIcon />
        <p className="text-sm text-foreground">
          <span className="font-medium">Choose an image</span> to replace the current one
        </p>
      </FileUploadDropzone>
      <FileUploadList>
        <FileUploadItem name="avatar.png" size={820_000} status="done" />
      </FileUploadList>
    </FileUpload>
  ),
};
