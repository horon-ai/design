import { Copy, FileText, X } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { cn } from "../lib/cn";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

/** Figma `Date separator` (Message extras 109:667): caption between two 10% ink lines. */
// prettier-ignore
export function DateSeparator({ children, className }: {
  /** Caption text between the rules, such as "Today" or "Mar 4". */
  children: ReactNode;
  /** Extra classes on the row, merged after the built-in ones. */
  className?: string;
}) {
  return (
    <div role="separator" className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-overlay-ink-10" />
      <span className="shrink-0 text-caption text-text-secondary">{children}</span>
      <span className="h-px flex-1 bg-overlay-ink-10" />
    </div>
  );
}

/** One button of a {@link MessageActions} pill. */
export type MessageAction = {
  /** Accessible label of the button; also its React key, so keep labels unique within a pill. */
  label: string;
  /** 16px glyph; sized by the pill's `[&>svg]:size-4`. */
  icon: ReactNode;
  /** Fires on click. */
  onClick?: () => void;
};

/**
 * Figma `Message actions` (109:667): a pill of 30px icon buttons with 16px icons, solid or regular glass.
 *
 * Hovering a button fills a circle behind the glyph; each button carries its
 * label as `aria-label` and the pill exposes `role="toolbar"`. With
 * `surface="glass"` it paints a `LiquidGlass` layer and the buttons sit above it.
 *
 * @example
 * ```tsx
 * <MessageActions
 *   actions={[
 *     { label: "Copy", icon: <Copy />, onClick: () => copy(text) },
 *     { label: "Regenerate", icon: <ArrowsClockwise />, onClick: regenerate },
 *   ]}
 * />
 * ```
 */
export function MessageActions({
  actions,
  surface = "solid",
  className,
}: {
  /** Buttons of the pill, rendered in order; each needs a unique label. */
  actions: MessageAction[];
  /** `solid` (default) is an opaque surface pill with a default border; `glass` is the regular glass pill. */
  surface?: "solid" | "glass";
  /** Extra classes on the pill, merged after the built-in ones. */
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
          className="relative flex size-7.5 motion-press cursor-pointer items-center justify-center rounded-full text-text-secondary motion-colors hover:bg-overlay-ink-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand [&>svg]:size-4"
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}

/** Props for {@link Attachment}: what the file is, how it looks and whether it can be removed. */
export type AttachmentProps = {
  /** File name, truncated to one line. */
  name: ReactNode;
  /** Caption, such as "PDF · 2.4 MB". */
  detail?: ReactNode;
  /** Image thumbnail URL; files show a document icon on a sky tile. */
  thumbnail?: string;
  /** Renders the 32px remove button when set. */
  onRemove?: () => void;
  /** Accessible label of the remove button.
   * @default "Remove" */
  removeLabel?: string;
  /** Extra classes on the card, merged after the built-in ones. */
  className?: string;
};

/** Figma `Attachment` (109:667): a flat subtle card with a 40px thumb, name, detail and remove button. */
export function Attachment({ name, detail, thumbnail, onRemove, removeLabel = "Remove", className }: AttachmentProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-70 min-w-0 motion-rise items-center gap-2.5 rounded-lg bg-bg-subtle py-2 pr-2 pl-2",
        className,
      )}
    >
      {thumbnail ? (
        <span
          aria-hidden
          className="size-10 shrink-0 rounded-[10px] bg-cover bg-center"
          style={{ backgroundImage: `url(${JSON.stringify(thumbnail)})` }}
        />
      ) : (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-accent-sky-500-16 text-text-brand">
          <FileText aria-hidden className="size-5" />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="truncate text-label-md text-text-primary">{name}</span>
        {detail && <span className="truncate text-caption text-text-secondary">{detail}</span>}
      </span>
      {onRemove && (
        <IconButton
          size="sm"
          icon={<X aria-hidden />}
          label={removeLabel}
          onClick={onRemove}
          className="text-text-secondary"
        />
      )}
    </div>
  );
}

/** Props for {@link CodeBlock}: the code text, its language caption and the copy-button labels. */
export type CodeBlockProps = Omit<ComponentProps<"div">, "className" | "children"> & {
  /** Source text, rendered verbatim inside a `<code>` in a horizontal scroller. */
  code: string;
  /** Caption in the header bar, such as "tsx"; the space is kept even when empty. */
  language?: string;
  /** Copy-button text before the copy succeeds.
   * @default "Copy" */
  copyLabel?: string;
  /** Copy-button text for 1500ms after a successful copy.
   * @default "Copied" */
  copiedLabel?: string;
  /** Extra classes on the outer `div`, merged after the built-in ones. */
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
  const { copied, copy } = useCopyToClipboard(1500);
  return (
    <div className={cn("flex flex-col overflow-clip rounded-lg bg-surface-ink", className)} {...props}>
      <div className="flex items-center gap-2 bg-bg-surface-6 py-2 pr-3.5 pl-3.5 text-caption text-text-on-ink">
        <span className="min-w-0 flex-1 opacity-70">{language}</span>
        <button
          type="button"
          onClick={() => copy(code)}
          className="flex shrink-0 motion-press cursor-pointer items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
        >
          <Copy aria-hidden className="size-3.5 shrink-0" />
          <span className="min-w-10 text-left">
            <span key={copied ? "copied" : "copy"} className="inline-block animate-fade-in">
              {copied ? copiedLabel : copyLabel}
            </span>
          </span>
        </button>
      </div>
      <pre className="overflow-x-auto px-3.5 pt-3 pb-3.5 font-mono text-code text-text-on-ink">
        <code>{code}</code>
      </pre>
    </div>
  );
}
