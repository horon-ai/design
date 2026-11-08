import { useMemo, useState, type ReactNode } from "@lynx-js/react";

import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Spinner } from "./spinner";

/**
 * Any JSON-shaped value: a string, number, boolean, `null`, or an array or object of the same.
 * `ToolCall` renders `args` and `result` through {@link JsonCode}, so plain objects and arrays are
 * enough; class instances and functions are not supported.
 */
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** One syntax colour of the printed JSON, matching React's token spans. */
type JsonTone = "key" | "string" | "number" | "punctuation" | "plain";

/** One printed line: its indent depth and the coloured tokens that make it up. */
type JsonLine = {
  /** Nesting depth; each level is two spaces, drawn as 14px of left padding. */
  indent: number;
  /** The line, in print order. */
  tokens: { text: string; tone: JsonTone }[];
};

/** The token colour classes; the plain tone keeps the block's string colour. */
const toneClass: Record<JsonTone, string> = {
  key: "text-syntax-key",
  string: "text-syntax-string",
  number: "text-syntax-number",
  punctuation: "text-syntax-punctuation",
  plain: "",
};

/**
 * Walks a JSON value and returns the printed lines, nesting one indentation step per level.
 *
 * Lynx text cannot hold a `pre` block with real newlines, so React's node tree is flattened into
 * one line per view; the tokens of a line stay nested `<text>` spans, which keeps the same syntax
 * colours and lets a long line scroll instead of wrapping.
 *
 * @param value - The JSON value to render.
 * @param indent - Current nesting depth; 0 for a root value, one extra level per object or array.
 * @returns The lines, each with its indent and coloured tokens.
 */
function jsonLines(value: Json, indent: number): JsonLine[] {
  if (value === null || typeof value === "number" || typeof value === "boolean") {
    return [{ indent, tokens: [{ text: String(value), tone: "number" }] }];
  }
  if (typeof value === "string") return [{ indent, tokens: [{ text: JSON.stringify(value), tone: "string" }] }];
  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value);
  const [open, close] = Array.isArray(value) ? ["[", "]"] : ["{", "}"];
  const lines: JsonLine[] = [{ indent, tokens: [{ text: open, tone: "punctuation" }] }];
  entries.forEach(([key, item], index) => {
    const head: { text: string; tone: JsonTone }[] = Array.isArray(value)
      ? []
      : [
          { text: JSON.stringify(key), tone: "key" },
          { text: ": ", tone: "punctuation" },
        ];
    const child = jsonLines(item, indent + 1);
    child[0] = { ...child[0], tokens: [...head, ...child[0].tokens] };
    if (index < entries.length - 1) {
      const last = child[child.length - 1];
      child[child.length - 1] = { ...last, tokens: [...last.tokens, { text: ",", tone: "punctuation" }] };
    }
    lines.push(...child);
  });
  lines.push({ indent, tokens: [{ text: close, tone: "punctuation" }] });
  return lines;
}

/**
 * JSON in Geist Mono code style with the Figma syntax colors (key, string, number, punctuation).
 *
 * Renders the JSON as monospaced lines inside a horizontal `scroll-view`, so long values scroll
 * rather than wrap, the same behaviour React's `overflow-x-auto whitespace-pre-wrap` pair produced
 * (Lynx has no `pre-wrap`). Used by {@link ToolCall} for tool arguments and results, and usable on
 * its own.
 *
 * @example
 * ```tsx
 * import { JsonCode } from "@horon-ai/lynx";
 *
 * <JsonCode value={{ query: "Horon design tokens", limit: 5 }} />
 * ```
 */
export function JsonCode({
  value,
  className,
}: {
  /** The JSON value to print; see `Json` for the accepted shapes. */
  value: Json;
  /** Extra classes for the block, for example a maximum height or `text-code` override. */
  className?: string;
}) {
  const lines = useMemo(() => {
    // Each printed token gets its own id so the nested `<text>` spans keep a stable key across
    // re-renders (React keyed the original node list by position, which oxlint forbids here).
    let next = 0;
    return jsonLines(value, 0).map((line) => ({
      id: next++,
      indent: line.indent,
      tokens: line.tokens.map((token) => ({ ...token, id: next++ })),
    }));
  }, [value]);

  return (
    <scroll-view
      scroll-orientation="horizontal"
      className={cn("max-w-full overflow-hidden", className)}
      scroll-bar-enable={false}
    >
      <view className="flex flex-col">
        {lines.map((line) => (
          <view key={line.id} className="flex flex-row items-start" style={{ paddingLeft: `${line.indent * 14}px` }}>
            <text className="whitespace-nowrap font-mono text-code">
              {line.tokens.map((token) => (
                <text key={token.id} className={toneClass[token.tone]}>
                  {token.text}
                </text>
              ))}
            </text>
          </view>
        ))}
      </view>
    </scroll-view>
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
    /** A 16px icon node; it sits inside the name pill in the secondary text color. */
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
  const { copied, copy, supported } = useCopyToClipboard(1500);
  return (
    <view className="flex min-w-0 flex-col gap-1.5">
      <view className="flex flex-row items-center gap-2">
        <view className="flex min-w-0 flex-1 flex-row items-center">
          <text className="text-label-sm text-text-secondary">{label.toUpperCase()}</text>
        </view>
        {copyText !== undefined && supported ? (
          <view
            className="motion-press flex flex-row items-center justify-center rounded-sm active:opacity-70"
            bindtap={() => copy(copyText)}
            accessibility-element
            accessibility-traits="button"
            accessibility-label={copied ? "Copied" : `Copy ${label.toLowerCase()}`}
          >
            <Icon
              key={copied ? "copied" : "copy"}
              name={copied ? "Check" : "Copy"}
              size={14}
              color={copied ? "status-live" : "text-secondary"}
            />
          </view>
        ) : null}
      </view>
      <view className="min-w-0 rounded-[10px] bg-bg-subtle px-3.5 py-3">{children}</view>
      {footer}
    </view>
  );
}

/**
 * Figma `Tool call` (Tool call card 186:7811): a solid 16px-radius card that expands to arguments and result.
 *
 * The header is a pressable row that shows the tool pill, the summary, a status icon (spinner, check
 * or warning) and a caret that rotates while open. The expanded body adds the failure notice with
 * Retry, the JSON `Arguments` section and the `Result` section with copy buttons. Base UI's
 * collapsible is replaced by local state (Lynx has no such primitive); the card is uncontrolled apart
 * from `defaultOpen`, and the panel is rendered only while open because Lynx cannot measure a
 * collapsing height. Use {@link JsonCode} directly when only the highlighted JSON is needed.
 *
 * @example
 * ```tsx
 * import { Icon, ToolCall } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <ToolCall
 *       status="done"
 *       tool={{ icon: <Icon name="Globe" size={16} color="text-secondary" />, name: "Web search" }}
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
  const [open, setOpen] = useState(Boolean(defaultOpen));

  return (
    <view
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-bg-surface",
        status === "failed" ? "border-border-danger" : "border-border-default",
        className,
      )}
    >
      <view
        className="motion-colors flex w-full flex-row items-center gap-2.5 px-4 py-3.5 active:bg-overlay-ink-3"
        bindtap={() => setOpen((value) => !value)}
        accessibility-element
        accessibility-traits="button"
        accessibility-value={open ? "expanded" : "collapsed"}
      >
        <view className="flex min-w-0 max-w-full shrink flex-row items-center gap-1.5 rounded-full bg-overlay-ink-6 py-[3px] pl-2 pr-2.5">
          {tool.icon}
          <text className="min-w-0 truncate text-label-md text-text-primary">{tool.name}</text>
        </view>
        <text className="min-w-0 flex-1 truncate text-body-sm text-text-secondary">{summary}</text>
        <view className="flex size-4 shrink-0 flex-row items-center justify-center">
          {status === "running" ? <Spinner key="running" size="sm" /> : null}
          {status === "done" ? <Icon key="done" name="CheckCircle" size={16} color="status-live" /> : null}
          {status === "failed" ? <Icon key="failed" name="WarningCircle" size={16} color="text-danger" /> : null}
        </view>
        {status === "failed" ? <text className="shrink-0 text-label-sm text-text-danger">Failed</text> : null}
        {elapsed ? <text className="shrink-0 text-caption text-text-secondary">{elapsed}</text> : null}
        <view
          className="flex size-4 shrink-0 flex-row items-center justify-center"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transitionProperty: "transform",
            transitionDuration: "200ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          accessibility-elements-hidden
        >
          <Icon name="CaretDown" size={16} color="text-secondary" />
        </view>
      </view>
      {open ? (
        <view className="flex min-w-0 flex-col gap-3.5 px-4 pb-4">
          {status === "failed" && error ? (
            <view className="flex flex-row items-center gap-2.5 rounded-[10px] bg-bg-danger px-3.5 py-3">
              <Icon name="WarningCircle" size={16} color="text-danger" />
              <text className="min-w-0 flex-1 text-body-sm text-text-danger">{error}</text>
              {onRetry ? (
                <view
                  className="motion-press flex h-[30px] shrink-0 flex-row items-center gap-1.5 rounded-full border border-border-default bg-bg-surface px-2.5"
                  bindtap={onRetry}
                  accessibility-element
                  accessibility-traits="button"
                  accessibility-label="Retry"
                >
                  <Icon name="ArrowClockwise" size={14} color="text-primary" />
                  <text className="text-label-sm text-text-primary">Retry</text>
                </view>
              ) : null}
            </view>
          ) : null}
          {args !== undefined ? (
            <Section label="Arguments" copyText={JSON.stringify(args, null, 2)}>
              <JsonCode value={args} />
            </Section>
          ) : null}
          {status !== "failed" ? (
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
                <text className="text-body-sm text-text-secondary">Waiting for result…</text>
              ) : (
                <JsonCode value={result} />
              )}
            </Section>
          ) : null}
        </view>
      ) : null}
    </view>
  );
}
