import { UploadSimple } from "@phosphor-icons/react";
import { type ComponentProps, type DragEvent, type ReactNode, useId, useState } from "react";

import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

export type FileDropProps = Omit<ComponentProps<"input">, "className" | "type" | "children" | "onDrop"> & {
  /** Label next to the icon. */
  label?: ReactNode;
  /** Shows a spinner in place of the icon while files upload. */
  uploading?: boolean;
  /** Danger rim for a rejected file. */
  rejected?: boolean;
  /** Called with the dropped files. */
  onFiles?: (files: File[]) => void;
  className?: string;
};

/**
 * Paper `File drop` (1VWI-0): a 1.5px dashed r10 target, icon 16 and a 13/18 500 label centred with gap 8.
 * Dragging swaps the dashes for a 1px brand rim over clear glass; no shake or bounce.
 */
export function FileDrop({
  label = "Drop files here or click to upload",
  uploading,
  rejected,
  onFiles,
  disabled,
  className,
  onChange,
  ...props
}: FileDropProps) {
  const id = useId();
  const [dragging, setDragging] = useState(false);

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    if (disabled || uploading) return;
    onFiles?.(Array.from(event.dataTransfer.files));
  };

  return (
    <label
      htmlFor={id}
      data-dragging={dragging ? "" : undefined}
      data-rejected={rejected ? "" : undefined}
      aria-busy={uploading || undefined}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "flex w-full max-w-[550px] cursor-pointer items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-dashed border-border-dashed px-4 py-3 text-[13px]/[18px] font-medium text-text-secondary motion-colors",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-text-brand",
        "data-dragging:border-solid data-dragging:border-border-brand data-dragging:bg-glass-clear",
        "data-rejected:border-solid data-rejected:border-border-danger",
        (disabled || uploading) && "cursor-not-allowed opacity-40",
        className,
      )}
    >
      <input
        id={id}
        type="file"
        className="sr-only"
        disabled={disabled || uploading}
        onChange={(event) => {
          onFiles?.(Array.from(event.target.files ?? []));
          onChange?.(event);
        }}
        {...props}
      />
      {uploading ? (
        <Spinner size={16} label="Uploading" />
      ) : (
        <UploadSimple aria-hidden className="size-4 shrink-0" />
      )}
      <span>{label}</span>
    </label>
  );
}
