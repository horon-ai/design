import { useState, type ReactNode } from "@lynx-js/react";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

/**
 * How the drop target is painted: `solid` fills it with the raised surface (`bg-bg-surface`), `glass`
 * leaves it transparent on the veil so imagery behind shows through.
 */
export type FileDropSurface = "solid" | "glass";

/**
 * One file the host reports, in place of the browser's `File`.
 *
 * Lynx has no `File`, `DataTransfer` or file-system API, so the target never produces files itself:
 * the host opens its own picker and passes the chosen files down through {@link FileDropProps.files},
 * and the tap reports them back through `onFiles`.
 */
export type FileDropFile = {
  /** File name, such as `report.pdf`. */
  name: string;
  /** Size in bytes, when the host knows it. */
  size?: number;
  /** MIME type, when the host knows it. */
  type?: string;
  /** Whatever handle the host's upload code needs back: a path, a URI or a native file id. */
  path?: string;
};

/**
 * Props of {@link FileDrop}: the picker members react kept from the native input, plus the target's own
 * state. React's type was `Omit<ComponentProps<"input">, "className" | "type" | "children" | "onDrop">
 * & { … }`; Lynx has no file input and no drag events, so only the picker hints survive that Omit and
 * the file handling moves to the host.
 */
export type FileDropProps = Omit<
  {
    /** `ComponentProps<"input">` on React: the extension or MIME list the host picker filters by. */
    accept?: string;
    /** Whether the host picker may return several files. */
    multiple?: boolean;
  },
  "className" | "type" | "children" | "onDrop"
> & {
  /** Label next to the icon. @default "Drop files here or click to upload" */
  label?: ReactNode;
  /** Shows a spinner in place of the icon while files upload. */
  uploading?: boolean;
  /** Danger rim for a rejected file. */
  rejected?: boolean;
  /** Called with the host-provided descriptors when the target is tapped; never called while uploading or disabled. */
  onFiles?: (files: FileDropFile[]) => void;
  /**
   * The files the host has queued for the next upload. A tap reports these through `onFiles`, which is
   * how a Lynx app turns its own picker result into the same callback react fired on drop and change.
   */
  files?: FileDropFile[];
  /** Runs before the report on every tap, so the host can open its own picker. */
  onPick?: () => void;
  /** `solid` (default) fills the target with the raised surface; `glass` puts it on the veil over imagery. @default "solid" */
  surface?: FileDropSurface;
  /** Extra classes for the target. */
  className?: string;
  /** Dims the target and ignores taps. */
  disabled?: boolean;
};

const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Paper `File drop` (1VWI-0): a 1.5px dashed r10 target, icon 16 and a 13/18 500 label centred with gap 8.
 * Dragging keeps the dashed edge and repaints it in the brand border, adds a 1px inset brand rim and, on
 * `solid`, shifts the fill to `bg-bg-subtle`; no shake or bounce. Solid fills with the raised surface,
 * glass sits on the veil (`veil-drop`) and keeps the dashed border as its only outline.
 *
 * Lynx has no file input and no drag events, so the target is one tappable `view`: react's drop target
 * becomes a press (a touch-down paints the same brand rim, because there is no drag-over to report), and
 * the files always come from the host — the tap runs `onPick` so the host can open its own picker and
 * reports the descriptors it was given through `files` back through `onFiles`. While `uploading`, the
 * icon becomes a spinner, taps are ignored and the label fades; `rejected` paints a danger rim. The
 * target is capped at 550px and never wider than its parent.
 *
 * @example
 * ```tsx
 * import { useState } from "@lynx-js/react";
 * import { FileDrop, type FileDropFile } from "@horon-ai/lynx";
 *
 * function Example() {
 *   const [files, setFiles] = useState<FileDropFile[]>([]);
 *   const [uploading, setUploading] = useState(false);
 *   return (
 *     <FileDrop
 *       label="Drop contracts here or tap to upload"
 *       files={files}
 *       uploading={uploading}
 *       onPick={() => void hostPicker.open().then(setFiles)}
 *       onFiles={(picked) => {
 *         setUploading(true);
 *         void upload(picked).finally(() => setUploading(false));
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
  files,
  onPick,
  surface = "solid",
  className,
  disabled = false,
  accept: _accept,
  multiple: _multiple,
}: FileDropProps) {
  const [pressed, setPressed] = useState(false);
  const blocked = disabled || uploading;

  const pick = () => {
    if (blocked) return;
    onPick?.();
    if (files) onFiles?.(files);
  };

  return (
    <view
      className={cn(
        "motion-colors relative flex w-full max-w-[550px] flex-row items-center justify-center gap-2 overflow-hidden rounded-[10px] border-[1.5px] border-dashed px-4 py-3",
        // The dashed edge stays put (border-style cannot transition) and the active state adds an inner rim.
        pressed && !blocked
          ? "border-border-brand shadow-[inset_0_0_0_1px_var(--color-text-brand)]"
          : "border-border-dashed",
        surface === "solid" ? cn("bg-bg-surface", pressed && !blocked && "bg-bg-subtle") : "veil-drop",
        rejected && "border-border-danger shadow-[inset_0_0_0_1px_var(--color-border-danger)]",
        blocked && "opacity-40",
        className,
      )}
      bindtap={pick}
      bindtouchstart={() => setPressed(true)}
      bindtouchend={() => setPressed(false)}
      bindtouchcancel={() => setPressed(false)}
      accessibility-element
      accessibility-traits={disabled ? "disabled" : "button"}
      accessibility-label={isPlainText(label) ? String(label) : undefined}
      accessibility-value={uploading ? "busy" : undefined}
    >
      <view className="relative flex flex-row items-center gap-2">
        {uploading ? (
          <Spinner size={16} label="Uploading" />
        ) : (
          <Icon name="UploadSimple" size={16} color={rejected ? "text-danger" : "text-secondary"} />
        )}
        {isPlainText(label) ? (
          <text
            className={cn("text-label-md", rejected ? "text-danger" : "text-text-secondary", uploading && "opacity-60")}
          >
            {label}
          </text>
        ) : (
          <view className={cn("flex flex-row items-center", uploading && "opacity-60")}>{label}</view>
        )}
      </view>
    </view>
  );
}
