import { UploadSimple } from "@phosphor-icons/react";
import { type ComponentProps, type DragEvent, type ReactNode, useId, useState } from "react";

import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

/**
 * How the drop target is painted: `solid` fills it with the raised surface (`bg-bg-surface`), `glass`
 * leaves it transparent on the veil so imagery behind shows through.
 */
export type FileDropSurface = "solid" | "glass";

/** Props of {@link FileDrop}: the native file input attributes plus the target's own state. */
export type FileDropProps = Omit<ComponentProps<"input">, "className" | "type" | "children" | "onDrop"> & {
  /** Label next to the icon. @default "Drop files here or click to upload" */
  label?: ReactNode;
  /** Shows a spinner in place of the icon while files upload. */
  uploading?: boolean;
  /** Danger rim for a rejected file. */
  rejected?: boolean;
  /** Called with the dropped or picked files, in picker order; fires on both drop and native file input change. */
  onFiles?: (files: File[]) => void;
  /** `solid` (default) fills the target with the raised surface; `glass` puts it on the veil over imagery. @default "solid" */
  surface?: FileDropSurface;
  /** Extra classes for the label that forms the target. */
  className?: string;
};

/**
 * Paper `File drop` (1VWI-0): a 1.5px dashed r10 target, icon 16 and a 13/18 500 label centred with gap 8.
 * Dragging keeps the dashed edge and repaints it in the brand border, adds a 1px inset brand rim and, on
 * `solid`, shifts the fill to `bg-bg-subtle`; no shake or bounce. Solid fills with the raised surface,
 * glass sits on the veil (`veil-drop`) and keeps the dashed border as its only outline.
 *
 * The target is a `<label>` around a screen-reader-only `<input type="file">`, so a click opens the native
 * picker and the control stays keyboard reachable; the focus ring is drawn on the label through
 * `has-[:focus-visible]`. Drops land in `onFiles` with `DataTransfer.files`, and the input's change event
 * also calls `onFiles` before forwarding `onChange`. While `uploading`, the icon becomes a spinner, the
 * input is disabled and drops are ignored; `rejected` paints a danger rim. The target is capped at 550px
 * and never wider than its parent.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { FileDrop } from "@horon-ai/react";
 *
 * function Example() {
 *   const [uploading, setUploading] = useState(false);
 *   return (
 *     <FileDrop
 *       accept=".pdf,.png"
 *       label="Drop contracts here or click to upload"
 *       uploading={uploading}
 *       onFiles={(files) => {
 *         setUploading(true);
 *         void upload(files).finally(() => setUploading(false));
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export function FileDrop({
  label = "Drop files here or click to upload",
  uploading,
  rejected,
  onFiles,
  surface = "solid",
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
        "relative flex w-full max-w-[550px] cursor-pointer items-center justify-center gap-2 overflow-clip rounded-[10px] border-[1.5px] border-dashed border-border-dashed px-4 py-3 text-label-md text-text-secondary motion-colors",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-text-brand",
        // The dashed edge stays put (border-style cannot transition) and the active state adds an inner rim.
        "data-dragging:border-border-brand data-dragging:shadow-[inset_0_0_0_1px_var(--color-text-brand)]",
        surface === "solid" ? "bg-bg-surface data-dragging:bg-bg-subtle" : "veil-drop",
        "data-rejected:border-border-danger data-rejected:text-text-danger data-rejected:shadow-[inset_0_0_0_1px_var(--color-border-danger)]",
        disabled && "cursor-not-allowed opacity-40",
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
      <span className="relative flex items-center gap-2">
        {uploading ? <Spinner size={16} label="Uploading" /> : <UploadSimple aria-hidden className="size-4 shrink-0" />}
        <span className={cn(uploading && "opacity-60")}>{label}</span>
      </span>
    </label>
  );
}
