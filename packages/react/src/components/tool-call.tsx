import { Collapsible } from "@base-ui/react/collapsible";
import { ArrowClockwise, CaretDown, Check, CheckCircle, Copy, WarningCircle } from "@phosphor-icons/react";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import { Spinner } from "./spinner";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const punctuation = (text: string) => <span className="text-syntax-punctuation">{text}</span>;

function renderJson(value: Json, indent: number): ReactNode[] {
  const pad = "  ".repeat(indent);
  if (value === null || typeof value === "number" || typeof value === "boolean") {
    return [
      <span key="v" className="text-syntax-number">
        {String(value)}
      </span>,
    ];
  }
  if (typeof value === "string") return [<span key="v">{JSON.stringify(value)}</span>];
  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value);
  const [open, close] = Array.isArray(value) ? ["[", "]"] : ["{", "}"];
  return [
    <span key="open">{punctuation(open)}</span>,
    ...entries.map(([key, item], index) => (
      <span key={key}>
        {"\n"}
        {pad}
        {"  "}
        {!Array.isArray(value) && (
          <>
            <span className="text-syntax-key">{JSON.stringify(key)}</span>
            {punctuation(":")}{" "}
          </>
        )}
        {renderJson(item, indent + 1)}
        {index < entries.length - 1 && punctuation(",")}
      </span>
    )),
    <span key="close">
      {"\n"}
      {pad}
      {punctuation(close)}
    </span>,
  ];
}

/** JSON in Geist Mono code style with the Figma syntax colors (key, string, number, punctuation). */
export function JsonCode({ value, className }: { value: Json; className?: string }) {
  return (
    <pre className={cn("overflow-x-auto font-mono text-code whitespace-pre-wrap text-syntax-string", className)}>
      {renderJson(value, 0)}
    </pre>
  );
}

export type ToolCallStatus = "running" | "done" | "failed";

export type ToolCallProps = {
  status: ToolCallStatus;
  /** Plain tool name, such as "Web search", with its 16px icon. */
  tool: { icon: ReactNode; name: ReactNode };
  summary: ReactNode;
  elapsed?: ReactNode;
  args?: Json;
  result?: Json;
  error?: ReactNode;
  onRetry?: () => void;
  /** The result is cut off; shows a "Show all" link under it. */
  truncated?: boolean;
  onShowAll?: () => void;
  defaultOpen?: boolean;
  className?: string;
};

function Section({
  label,
  children,
  copyText,
  footer,
}: {
  label: string;
  children: ReactNode;
  /** Plain text of the section body; adds a real copy button when present. */
  copyText?: string;
  footer?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-label-sm text-text-secondary">
        <span className="flex-1 uppercase">{label}</span>
        {copyText !== undefined && (
          <button
            type="button"
            aria-label={copied ? "Copied" : `Copy ${label.toLowerCase()}`}
            onClick={() => {
              navigator.clipboard?.writeText(copyText).then(
                () => setCopied(true),
                () => undefined,
              );
            }}
            className="flex motion-press cursor-pointer items-center justify-center rounded-sm hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
          >
            {copied ? (
              <Check key="copied" aria-hidden className="size-3.5 animate-pop-in text-status-live" />
            ) : (
              <Copy key="copy" aria-hidden className="size-3.5 animate-pop-in" />
            )}
          </button>
        )}
      </div>
      <div className="rounded-[10px] bg-bg-subtle px-3.5 py-3">{children}</div>
      {footer}
    </div>
  );
}

/** Figma `Tool call` (Tool call card 186:7811): a solid 16px-radius card that expands to arguments and result. */
export function ToolCall({
  status,
  tool,
  summary,
  elapsed,
  args,
  result,
  error,
  onRetry,
  truncated,
  onShowAll,
  defaultOpen,
  className,
}: ToolCallProps) {
  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      className={cn(
        "flex flex-col overflow-clip rounded-2xl border bg-bg-surface",
        status === "failed" ? "border-border-danger" : "border-border-default",
        className,
      )}
    >
      <Collapsible.Trigger className="group flex w-full cursor-pointer items-center gap-2.5 px-4 py-3.5 text-left motion-colors hover:bg-overlay-ink-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-brand">
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-overlay-ink-6 py-[3px] pr-2.5 pl-2 text-label-md text-text-primary [&>svg]:size-4 [&>svg]:text-text-secondary">
          {tool.icon}
          {tool.name}
        </span>
        <span className="min-w-0 flex-1 truncate text-body-sm text-text-secondary">{summary}</span>
        <span className="flex size-4 shrink-0 items-center justify-center">
          {status === "running" && <Spinner key="running" size="sm" className="animate-pop-in" />}
          {status === "done" && (
            <CheckCircle key="done" aria-hidden className="size-4 animate-pop-in text-status-live" />
          )}
          {status === "failed" && (
            <WarningCircle key="failed" aria-hidden className="size-4 animate-pop-in text-text-danger" />
          )}
        </span>
        {status === "failed" && <span className="shrink-0 text-label-sm text-text-danger">Failed</span>}
        {elapsed && <span className="shrink-0 text-caption text-text-secondary">{elapsed}</span>}
        <CaretDown
          aria-hidden
          className="size-4 shrink-0 text-text-secondary transition-transform duration-200 ease-out-quint group-data-panel-open:rotate-180"
        />
      </Collapsible.Trigger>
      <Collapsible.Panel className="motion-collapse">
        <div className="flex flex-col gap-3.5 px-4 pb-4">
          {status === "failed" && error && (
            <div className="flex items-center gap-2.5 rounded-[10px] bg-bg-danger px-3.5 py-3">
              <WarningCircle aria-hidden className="size-4 shrink-0 text-text-danger" />
              <p className="min-w-0 flex-1 text-body-sm text-text-danger">{error}</p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex h-7.5 shrink-0 motion-press cursor-pointer items-center gap-1.5 rounded-full border border-border-default bg-bg-surface px-2.5 text-label-sm text-text-primary"
                >
                  <ArrowClockwise aria-hidden className="size-3.5" />
                  Retry
                </button>
              )}
            </div>
          )}
          {args !== undefined && (
            <Section label="Arguments" copyText={JSON.stringify(args, null, 2)}>
              <JsonCode value={args} />
            </Section>
          )}
          {status !== "failed" && (
            <Section
              label="Result"
              copyText={typeof result === "string" ? result : JSON.stringify(result, null, 2)}
              footer={
                truncated && result !== undefined && status !== "running" ? (
                  <Button variant="link" className="self-start px-0" onClick={onShowAll}>
                    Show all
                  </Button>
                ) : undefined
              }
            >
              {status === "running" || result === undefined ? (
                <p className="text-body-sm text-text-secondary">Waiting for result…</p>
              ) : (
                <JsonCode value={result} />
              )}
            </Section>
          )}
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

export type { Json };
