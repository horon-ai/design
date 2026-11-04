import { Copy, FileText, X } from "@phosphor-icons/react";
import { useState, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

/** Figma `Date separator` (Message extras 109:667): caption between two 10% ink lines. */
export function DateSeparator({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="separator" className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-overlay-ink-10" />
      <span className="shrink-0 text-caption text-text-secondary">{children}</span>
      <span className="h-px flex-1 bg-overlay-ink-10" />
    </div>
  );
}

export type MessageAction = { label: string; icon: ReactNode; onClick?: () => void };

/** Figma `Message actions` (109:667): a pill of 30px icon buttons with 16px icons, solid or regular glass. */
export function MessageActions({
  actions,
  surface = "solid",
  className,
}: {
  actions: MessageAction[];
  /** `solid` (default) is an opaque surface pill with a default border; `glass` is the regular glass pill. */
  surface?: "solid" | "glass";
  className?: string;
}) {
  return (
    <div
      role="toolbar"
      className={cn(
        "relative flex w-fit items-center gap-0.5 overflow-clip rounded-full p-[3px]",
        surface === "glass" ? "bg-glass-regular" : "border border-border-default bg-bg-surface",
        className,
      )}
    >
      {surface === "glass" && <LiquidGlass />}
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          aria-label={action.label}
          onClick={action.onClick}
          className="relative flex size-7.5 motion-press cursor-pointer items-center justify-center rounded-full text-text-secondary motion-colors hover:bg-overlay-ink-6 focus-visible:outline-2 focus-visible:outline-text-brand [&>svg]:size-4"
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}

export type AttachmentProps = {
  name: ReactNode;
  /** Caption, such as "PDF · 2.4 MB". */
  detail?: ReactNode;
  /** Image thumbnail URL; files show a document icon on a sky tile. */
  thumbnail?: string;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
};

/** Figma `Attachment` (109:667): a flat subtle card with a 40px thumb, name, detail and remove button. */
export function Attachment({ name, detail, thumbnail, onRemove, removeLabel = "Remove", className }: AttachmentProps) {
  return (
    <div className={cn("flex w-70 items-center gap-2.5 rounded-lg bg-bg-subtle py-2 pr-3 pl-2", className)}>
      {thumbnail ? (
        <span
          aria-hidden
          className="size-10 shrink-0 rounded-[10px] bg-cover bg-center"
          style={{ backgroundImage: `url(${JSON.stringify(thumbnail)})` }}
        />
      ) : (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-sky-100 text-text-primary">
          <FileText aria-hidden className="size-5" />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="truncate text-label-md text-text-primary">{name}</span>
        {detail && <span className="truncate text-caption text-text-secondary">{detail}</span>}
      </span>
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="flex shrink-0 motion-press cursor-pointer text-text-secondary focus-visible:outline-2 focus-visible:outline-text-brand"
        >
          <X aria-hidden className="size-4" />
        </button>
      )}
    </div>
  );
}

export type CodeBlockProps = Omit<ComponentProps<"div">, "className" | "children"> & {
  code: string;
  language?: string;
  copyLabel?: string;
  copiedLabel?: string;
  className?: string;
};

/** Figma `Code block` (109:667): ink surface, 14px radius, 6% header with copy, Geist Mono 13/20 code. */
export function CodeBlock({
  code,
  language,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(code).then(() => setCopied(true));
  };
  return (
    <div className={cn("flex flex-col overflow-clip rounded-lg bg-surface-ink", className)} {...props}>
      <div className="flex items-center gap-2 bg-bg-surface-6 py-2 pr-3 pl-3.5 text-caption text-text-on-ink">
        <span className="min-w-0 flex-1 opacity-70">{language}</span>
        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 motion-press cursor-pointer items-center gap-1 focus-visible:outline-2 focus-visible:outline-text-brand"
        >
          <Copy aria-hidden className="size-3.5" />
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="overflow-x-auto px-3.5 pt-3 pb-3.5 font-mono text-code text-text-on-ink">
        <code>{code}</code>
      </pre>
    </div>
  );
}
