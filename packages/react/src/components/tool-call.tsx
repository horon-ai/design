import { Collapsible } from "@base-ui/react/collapsible";
import { ArrowClockwise, CaretDown, Check, CheckCircle, Copy, WarningCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Spinner } from "./spinner";

/**
 * Any JSON-shaped value: a string, number, boolean, `null`, or an array or object of the same.
 * `ToolCall` renders `args` and `result` through {@link JsonCode}, so plain objects and arrays are
 * enough; class instances and functions are not supported.
 */
type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const punctuation = (text: string) => <span className="text-syntax-punctuation">{text}</span>;

/**
 * Walks a JSON value and returns syntax-highlighted React nodes, nesting one indentation step per level.
 *
 * @param value - The JSON value to render.
 * @param indent - Current nesting depth; 0 for a root value, one extra level per object or array.
 * @returns A flat list of span nodes for the key, string, number and punctuation syntax colors.
 */
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

/**
 * JSON in Geist Mono code style with the Figma syntax colors (key, string, number, punctuation).
 *
 * Renders a `pre` in the code type token that wraps lines so long values stay inside a narrow card;
 * it scrolls horizontally only when a single unbreakable token overflows. Used by {@link ToolCall}
 * for tool arguments and results, and usable on its own.
 */
// prettier-ignore
export function JsonCode({ value, className }: {
  /** The JSON value to print; see `Json` for the accepted shapes. */
  value: Json;
  /** Extra classes for the `pre`, for example a maximum height or `text-code` override. */
  className?: string;
}) {
  return (
    <pre
      className={cn("max-w-full overflow-x-auto font-mono text-code whitespace-pre-wrap text-syntax-string", className)}
    >
      {renderJson(value, 0)}
    </pre>
  );
}

/**
 * Lifecycle state of a tool call.
 *
 * - `running`: a spinner replaces the status icon and the result section shows "Waiting for result…".
 * - `done`: a live-green check marks the row and the result is printed.
 * - `failed`: the card border turns danger, an error notice (with an optional Retry button) replaces the result.
 */
export type ToolCallStatus = "running" | "done" | "failed";

/**
 * Props for {@link ToolCall}.
 */
export type ToolCallProps = {
  /** Current lifecycle state; drives the status icon, border and which sections appear. */
  status: ToolCallStatus;
  /** Plain tool name, such as "Web search", with its 16px icon. */
  tool: {
    /** A 16px Phosphor icon; it inherits the secondary text color inside the name pill. */
    icon: ReactNode;
    /** The visible tool name; truncates when the header runs out of room. */
    name: ReactNode;
  };
  /** One-line description of the call, such as the query that was sent. */
  summary: ReactNode;
  /** Elapsed time, such as "1.2s"; hidden when omitted. */
  elapsed?: ReactNode;
  /** Arguments object printed as JSON in an `Arguments` section when defined. */
  args?: Json;
  /** Result value printed as JSON in a `Result` section while the call is `running` (as a waiting message) or `done`; a `failed` call omits the section in favour of `error`. */
  result?: Json;
  /** Failure message shown instead of the result section when `status` is `failed`. */
  error?: ReactNode;
  /** Renders a Retry button on the failure notice; omit it to show the error without a retry. */
  onRetry?: () => void;
  /** The result is cut off; shows a "Show all" link under it. */
  truncated?: boolean;
  /** Called when the "Show all" link is pressed; only rendered when `truncated` is set and a result exists. */
  onShowAll?: () => void;
  /** Starts the card expanded; the card manages its own open state afterwards. */
  defaultOpen?: boolean;
  /** Extra classes for the card root. */
  className?: string;
};

/**
 * One labelled block inside the expanded card: an uppercase label row with an optional copy button,
 * a subtle rounded body, and an optional footer (used for the "Show all" link).
 */
function Section({
  label,
  children,
  copyText,
  footer,
}: {
  /** Uppercase heading, such as "Arguments"; also names the copy button for screen readers. */
  label: string;
  /** Body content, normally a {@link JsonCode} block or the waiting message. */
  children: ReactNode;
  /** Plain text of the section body; adds a real copy button when present. */
  copyText?: string;
  /** Content under the body, such as the truncated "Show all" link. */
  footer?: ReactNode;
}) {
  const { copied, copy } = useCopyToClipboard(1500);
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-center gap-2 text-label-sm text-text-secondary">
        <span className="flex-1 uppercase">{label}</span>
        {copyText !== undefined && (
          <button
            type="button"
            aria-label={copied ? "Copied" : `Copy ${label.toLowerCase()}`}
            onClick={() => copy(copyText)}
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
      <div className="min-w-0 rounded-md bg-bg-subtle px-3.5 py-3">{children}</div>
      {footer}
    </div>
  );
}

/**
 * Figma `Tool call` (Tool call card 186:7811): a solid 16px-radius card that expands to arguments and result.
 *
 * The header trigger is a Base UI collapsible: it shows the tool pill, the summary, a status icon
 * (spinner, check or warning) and a caret that rotates while open. The expanded body adds the
 * failure notice with Retry, the JSON `Arguments` section and the `Result` section with copy buttons.
 * The card is uncontrolled apart from `defaultOpen`; use {@link JsonCode} directly when only the
 * highlighted JSON is needed.
 *
 * @example
 * ```tsx
 * import { ToolCall } from "@horon-ai/react";
 * import { Globe } from "@phosphor-icons/react";
 *
 * function Example() {
 *   return (
 *     <ToolCall
 *       status="done"
 *       tool={{ icon: <Globe />, name: "Web search" }}
 *       summary="Fetched 8 results for Horon tokens"
 *       elapsed="1.2s"
 *       args={{ query: "Horon design tokens" }}
 *       result={{ results: 8 }}
 *     />
 *   );
 * }
 * ```
 */
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
        "flex w-full min-w-0 flex-col overflow-clip rounded-2xl border bg-bg-surface",
        status === "failed" ? "border-border-danger" : "border-border-default",
        className,
      )}
    >
      <Collapsible.Trigger className="group flex w-full cursor-pointer items-center gap-2.5 px-4 py-3.5 text-left motion-colors hover:bg-overlay-ink-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-brand">
        <span className="flex max-w-full min-w-0 shrink items-center gap-1.5 rounded-full bg-overlay-ink-6 py-[3px] pr-2.5 pl-2 text-label-md text-text-primary [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-text-secondary">
          {tool.icon}
          <span className="min-w-0 truncate">{tool.name}</span>
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
        <div className="flex min-w-0 flex-col gap-3.5 px-4 pb-4">
          {status === "failed" && error && (
            <div className="flex items-center gap-2.5 rounded-md bg-bg-danger px-3.5 py-3">
              <WarningCircle aria-hidden className="size-4 shrink-0 text-text-danger" />
              <p className="min-w-0 flex-1 text-body-sm text-text-danger">{error}</p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex h-7.5 shrink-0 motion-press cursor-pointer items-center gap-1.5 rounded-full border border-border-default bg-bg-surface px-2.5 text-label-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
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
