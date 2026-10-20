"use client";

import * as React from "react";
import { CircleAlertIcon, FileTextIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import { Button } from "@horon/web/components/button";
import { cn } from "cn";

type FileUploadStatus = "idle" | "uploading" | "done" | "error";

type FileUploadContextValue = {
  files: File[];
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  openFileDialog: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept?: string;
  multiple: boolean;
};

const FileUploadContext = React.createContext<FileUploadContextValue | null>(null);

function useFileUpload() {
  const context = React.useContext(FileUploadContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a FileUpload");
  }
  return context;
}

const EMPTY_FILES: File[] = [];

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value >= 10 ? Math.round(value) : value.toFixed(1)} ${units[unitIndex]}`;
}

function FileUpload({
  className,
  files: filesProp,
  defaultFiles = EMPTY_FILES,
  onFilesChange,
  accept,
  multiple = true,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  files?: File[];
  defaultFiles?: File[];
  onFilesChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}) {
  const [uncontrolledFiles, setUncontrolledFiles] = React.useState<File[]>(defaultFiles);
  const controlled = filesProp !== undefined;
  const files = controlled ? filesProp : uncontrolledFiles;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const setFiles = React.useCallback(
    (next: File[]) => {
      if (!controlled) {
        setUncontrolledFiles(next);
      }
      onFilesChange?.(next);
    },
    [controlled, onFilesChange],
  );

  const addFiles = React.useCallback(
    (incoming: File[]) => {
      if (multiple) {
        setFiles([...files, ...incoming]);
        return;
      }
      setFiles(incoming.slice(0, 1));
    },
    [files, multiple, setFiles],
  );

  const removeFile = React.useCallback(
    (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
    },
    [files, setFiles],
  );

  const openFileDialog = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const value = React.useMemo(
    () => ({
      files,
      addFiles,
      removeFile,
      openFileDialog,
      inputRef,
      accept,
      multiple,
    }),
    [files, addFiles, removeFile, openFileDialog, accept, multiple],
  );

  return (
    <FileUploadContext.Provider value={value}>
      <div data-slot="file-upload" className={cn("flex w-full flex-col gap-3", className)} {...props}>
        <input
          ref={inputRef}
          data-slot="file-upload-input"
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(event) => {
            addFiles(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        {children}
      </div>
    </FileUploadContext.Provider>
  );
}

function FileUploadDropzone({
  className,
  onClick,
  onKeyDown,
  onDragOver,
  onDragLeave,
  onDrop,
  ...props
}: React.ComponentProps<"div">) {
  const { addFiles, openFileDialog, multiple } = useFileUpload();
  const [dragging, setDragging] = React.useState(false);

  return (
    <div
      data-slot="file-upload-dropzone"
      data-dragging={dragging ? "" : undefined}
      role="button"
      tabIndex={0}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card px-6 py-8 text-center text-sm text-muted-foreground transition-colors outline-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[dragging]:border-primary data-[dragging]:bg-primary/5 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        openFileDialog();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFileDialog();
        }
      }}
      onDragOver={(event) => {
        onDragOver?.(event);
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(event) => {
        onDragLeave?.(event);
        setDragging(false);
      }}
      onDrop={(event) => {
        onDrop?.(event);
        event.preventDefault();
        setDragging(false);
        const dropped = Array.from(event.dataTransfer.files);
        addFiles(multiple ? dropped : dropped.slice(0, 1));
      }}
    />
  );
}

function FileUploadTrigger({
  className,
  onClick,
  variant = "outline",
  size = "sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { openFileDialog } = useFileUpload();

  return (
    <Button
      data-slot="file-upload-trigger"
      variant={variant}
      size={size}
      {...props}
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        openFileDialog();
      }}
    />
  );
}

function FileUploadList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="file-upload-list" className={cn("flex flex-col gap-2", className)} {...props} />;
}

function FileUploadItem({
  className,
  name,
  size,
  status = "done",
  onRemove,
  children,
  ...props
}: React.ComponentProps<"li"> & {
  name?: string;
  size?: number;
  status?: FileUploadStatus;
  onRemove?: () => void;
}) {
  const description = typeof size === "number" ? formatBytes(size) : undefined;

  return (
    <li
      data-slot="file-upload-item"
      data-status={status}
      className={cn(
        "group/file-upload-item flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 text-sm text-card-foreground data-[status=error]:border-destructive/30",
        className,
      )}
      {...props}
    >
      <span
        data-slot="file-upload-item-media"
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-data-[status=error]/file-upload-item:bg-destructive/10 group-data-[status=error]/file-upload-item:text-destructive [&_svg:not([class*='size-'])]:size-4"
      >
        {status === "error" ? (
          <CircleAlertIcon />
        ) : status === "uploading" ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          <FileTextIcon />
        )}
      </span>
      <div data-slot="file-upload-item-content" className="flex min-w-0 flex-1 flex-col gap-0.5">
        {children ?? (
          <>
            <span data-slot="file-upload-item-name" className="truncate font-medium text-foreground">
              {name}
            </span>
            {description ? (
              <span
                data-slot="file-upload-item-description"
                className="truncate text-xs text-muted-foreground tabular-nums"
              >
                {description}
              </span>
            ) : null}
          </>
        )}
      </div>
      {onRemove ? (
        <Button
          data-slot="file-upload-item-remove"
          variant="ghost"
          size="icon-xs"
          aria-label={name ? `Remove ${name}` : "Remove file"}
          className="shrink-0 text-muted-foreground"
          onClick={onRemove}
        >
          <XIcon />
        </Button>
      ) : null}
    </li>
  );
}

export { FileUpload, FileUploadDropzone, FileUploadList, FileUploadItem, FileUploadTrigger };
